# C++ REST framework patterns

For each framework: how to spot it, where the method/path live, where query params come from, where the body is parsed, and where the response is built. Use these as a lookup, not a checklist to recite back — the goal is finding the four pieces of information (method, path, params in, body out), wherever they live.

## Crow

**Spot it:** `#include "crow.h"` / `#include "crow_all.h"`, `CROW_ROUTE`, `crow::SimpleApp`.

- **Method + path:** `CROW_ROUTE(app, "/users/<int>")` — the angle-bracket segments (`<int>`, `<string>`) are path params, typed inline. `.methods("GET"_method, "POST"_method)` right after the macro sets the method(s); a bare `CROW_ROUTE` with a lambda taking `(const crow::request&)` and no `.methods()` defaults to GET.
- **Query params:** `req.url_params.get("name")` — always returns a `const char*` (null if absent), so absence-checked calls are optional, unchecked/dereferenced ones are effectively required.
- **Request body:** `crow::json::load(req.body)` returns a `crow::json::rvalue`; fields are read with `x["field"]` or `x["field"].s()/.i()/.d()/.b()`. A field only read inside `if (x.has("field"))` is optional.
- **Response:** `crow::json::wvalue` built up with `resp["field"] = value;`, returned via `crow::response(code, resp)` or implicitly from the handler's return value. The numeric literal passed to `crow::response(...)` (or `return crow::response(404, ...)`) is the status code.

## Drogon

**Spot it:** `#include <drogon/drogon.h>`, classes deriving from `drogon::HttpController<T>`, `ADD_METHOD_TO`, `HttpRequestPtr`, `HttpResponsePtr`.

- **Method + path:** `ADD_METHOD_TO(Controller::handler, "/users/{id}", drogon::Get);` inside `METHOD_LIST_BEGIN/END`, or `app().registerHandler("/users/{id}", &handler, {Get})`. `{id}`-style segments are path params.
- **Query params:** `req->getParameter("name")` (returns empty string if absent — check `req->getOptionalParameter<T>("name")` for a real optional).
- **Request body:** `req->getJsonObject()` returns a `shared_ptr<Json::Value>`; fields read via `(*json)["field"].asString()/.asInt()/...`. Guarded by `json->isMember("field")` → optional.
- **Response:** build a `Json::Value`, set fields with `ret["field"] = value;`, wrap with `HttpResponse::newHttpJsonResponse(ret)`, and set the code with `resp->setStatusCode(k200OK)` etc. (`k201Created`, `k404NotFound`, ...).

## Pistache

**Spot it:** `#include <pistache/...>`, `Rest::Router`, `Rest::Routes::Get/Post/Put/Delete`.

- **Method + path:** `Routes::Get(router, "/users/:id", Routes::bind(&Handler::getUser))` — the `Routes::xxx` call name is the HTTP method, the string is the path (`:id` = path param).
- **Query params:** `request.query().get("name")` returns an `Optional<std::string>` — check `.isEmpty()` to know if it's genuinely optional, vs. immediately dereferenced with `.get()` treated as required.
- **Path params:** `request.param(":id").as<int>()`.
- **Request body:** `request.body()` is a raw string, typically parsed manually (e.g. with nlohmann::json — see below) or with a project-specific helper.
- **Response:** `response.send(Http::Code::Ok, jsonString)` — the `Http::Code::*` value is the status.

## oatpp

**Spot it:** `#include "oatpp/...`, `ENDPOINT(...)` macro, classes with `ENDPOINT_INFO`, DTOs declared with `class Foo : public oatpp::DTO` and `DTO_INIT` / `ADD_DTO_FIELD`.

- **Method + path:** `ENDPOINT("GET", "/users/{id}", getUser, PATH(Int32, id))` — first arg is the method, second the path, remaining macro args (`PATH(...)`, `QUERY(...)`, `BODY_DTO(...)`) describe params.
- **Query params:** `QUERY(String, name, "name")` in the `ENDPOINT` macro — a `QUERY(..., "name", "default")` with a default value, or the field's type wrapped as nullable in the DTO, marks it optional.
- **Request body:** `BODY_DTO(Object<UserDto>, dto)` — the DTO's field list (via `ADD_DTO_FIELD`) is the actual body shape; fields declared without `= nullptr`/default are effectively required.
- **Response:** DTO returned via `createDtoResponse(Status::CODE_200, dto)`; the `Status::CODE_*` constant is the status.

## cpprestsdk (Casablanca)

**Spot it:** `#include <cpprest/...>`, `web::http::experimental::listener::http_listener`, `.support(methods::GET, ...)`.

- **Method + path:** `listener.support(methods::GET, handler)` registered per-listener-URI, or dispatched manually by inspecting `request.relative_uri().path()` inside one handler — look for `if/else`/`switch` branches on the path string.
- **Query params:** `web::uri::split_query(request.request_uri().query())` → a map; `.find("name") != map.end()` marks optional vs. required.
- **Request body:** `request.extract_json().then([](json::value body){ ... })` — fields read with `body.at("field")` or `body[U("field")]`; `body.has_field(U("field"))` guards mark optional.
- **Response:** a `json::value` built with `resp[U("field")] = json::value::string(...)` etc., sent via `request.reply(status_codes::OK, resp)` — the `status_codes::*` constant is the status.

## restbed

**Spot it:** `#include <restbed>`, `restbed::Resource`, `resource->set_method_handler(...)`.

- **Method + path:** `resource->set_path("/users/{id}")` plus a separate `resource->set_method_handler("GET", handler)` — method and path are set in two different calls on the same `Resource` object, so match them up by which resource they're attached to.
- **Path/query params:** `request->get_path_parameter("id")`, `request->get_query_parameter("name")` — an overload taking a default value (`get_query_parameter("name", "default")`) marks the param optional; the no-default overload is required.
- **Request body:** `session->fetch(content_length, [](const shared_ptr<Session> session, const Bytes& body){ ... })`, then typically parsed with a JSON library — see the fallback JSON-library notes below.
- **Response:** `session->close(OK, body, headers)` — the first arg is the status code.

## Boost.Beast

**Spot it:** `#include <boost/beast/...>`, `boost::beast::http::request<...>`, manual `http::verb::get` comparisons.

Beast is a low-level HTTP library, not a router — there's usually a hand-rolled dispatch function. Look for:

- **Method + path:** an `if/else`/`switch` on `req.method() == http::verb::get` combined with a check on `req.target()` (the path).
- **Query params:** manual parsing of `req.target()`'s query string (no built-in helper — look for a local `parse_query` function or similar).
- **Request body:** `req.body()` is a raw string, parsed manually — see the JSON-library fallback below.
- **Response:** a `http::response<http::string_body>` with `.result(http::status::ok)` and `.body() = ...`.

## JSON library used for (de)serialization

Regardless of framework, the actual field-by-field shape usually comes from whichever JSON library is used to read/write the body. Recognize these regardless of framework:

- **nlohmann::json**: `j["field"].get<T>()`, `j.at("field")`, `j.value("field", default)` (has a default → optional), `j.contains("field")` guard → optional. Structs with `NLOHMANN_DEFINE_TYPE_INTRUSIVE(Type, field1, field2, ...)` or `to_json`/`from_json` free functions declare the exact field list and names.
- **RapidJSON**: `doc["field"].GetString()/.GetInt()/...`, `doc.HasMember("field")` guard → optional.
- **Boost.JSON**: `jv.at("field").as_string()`, `jv.as_object().if_contains("field")` → optional.
- **Protobuf** (if the endpoint wraps a `.proto`-defined message rather than hand-written JSON): the `.proto` file is the real source of truth for the body/response shape — ask for it if it's not already available, since scalar field presence (`optional` keyword, `oneof`) directly maps to Zod optionality.

## Custom / unrecognized framework

If none of the above match, the four questions still apply — just find them wherever the code puts them:

1. **Method + path**: look for string literals matching HTTP verbs (`"GET"`, `"POST"`, ...) and path-like strings (containing `/`), usually near a `route(...)`, `register(...)`, `add_handler(...)`, or similar call, or in a comment directly above the handler (`// GET /users/:id` is common in hand-rolled routers).
2. **Query/path params**: look for any map/dictionary lookup keyed by a string on an incoming request object, and whether the lookup is guarded (optional) or assumed to succeed (required).
3. **Request body fields**: look for whichever JSON library is used (see above) and read the field list from there.
4. **Response fields + status code**: look for where an outgoing JSON-like object is populated and where a numeric or named status constant is set right before the response is sent.

If genuinely nothing in the file indicates a field's type or optionality (e.g. it's passed through opaquely without ever being read), say so explicitly rather than inventing a type.
