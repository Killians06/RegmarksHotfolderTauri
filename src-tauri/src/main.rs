// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod events;

use events::{create_menu, handle_menu_event};

fn main() {
  tauri::Builder::default()
    .menu(create_menu())
    .on_menu_event(|event| handle_menu_event(&event.window(), event.menu_item_id()))  
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
