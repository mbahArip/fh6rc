use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::sync::Mutex;
use tauri::State;

struct DiscordState(Mutex<Option<DiscordIpcClient>>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn update_discord_presence(
    state: State<'_, DiscordState>,
    details: Option<String>, // e.g. "Listening to Song"
    status: Option<String>,  // e.g. "Artist - Album"
    large_image_key: Option<String>, // e.g. "universal-radio"
) -> Result<(), String> {
    let mut client_lock = state.0.lock().unwrap();

    // Initialize if not present
    if client_lock.is_none() {
        let mut new_client = DiscordIpcClient::new("1527685823007555734");
        if new_client.connect().is_ok() {
            *client_lock = Some(new_client);
        }
    }

    // Update activity
    if let Some(client) = client_lock.as_mut() {
        let mut act = activity::Activity::new();

        let details_ref = details.as_deref();
        if let Some(d) = details_ref {
            act = act.details(d);
        }

        let state_ref = status.as_deref();
        if let Some(s) = state_ref {
            act = act.state(s);
        }

        let mut assets = activity::Assets::new();
        let large_img_ref = large_image_key.as_deref();
        if let Some(img) = large_img_ref {
            assets = assets.large_image(img);
            act = act.assets(assets);
        }

        let _ = client.set_activity(act);
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(DiscordState(Mutex::new(None)))
        .plugin(
            tauri_plugin_log::Builder::new()
                .max_file_size(10_000_000)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .target(tauri_plugin_log::Target::new(
                  tauri_plugin_log::TargetKind::LogDir {
                    file_name: Some(format!("logs_{}", chrono::Local::now().format("%Y_%m_%d")))
                  }
                ))
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, update_discord_presence])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
