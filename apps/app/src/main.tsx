import "@fh6rc/ui/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "~/App";
import AppProvider from "~/components/layout/ProviderLayout";

const route = createBrowserRouter([
  {
    Component: AppProvider,
    children: [{ index: true, Component: App }],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>,
);
