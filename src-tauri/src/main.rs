// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use notify::{EventKind, RecommendedWatcher, RecursiveMode, Watcher, Config};
use serde::Deserialize;
use std::fs;
use std::path::Path;
use std::sync::mpsc::channel;
use tauri::Manager;
mod events;

use events::{create_menu, handle_menu_event};
use std::sync::{Arc, Mutex};

#[derive(Default)]
struct WatcherState {
    watcher: Option<RecommendedWatcher>,
}

#[derive(Deserialize)]
struct Data {
    input: String,
}

fn main() {
    tauri::Builder::default()
        .menu(create_menu())
        .on_menu_event(|event| handle_menu_event(&event.window(), event.menu_item_id()))
        .manage(Arc::new(Mutex::new(WatcherState::default())))
        .invoke_handler(tauri::generate_handler![start_monitoring, stop_monitoring])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[tauri::command]
// fn start_monitoring(app_handle: tauri::AppHandle) {
//     std::thread::spawn(move || {
//         // Lire le fichier data.json
//         let data_file = app_handle
//             .path_resolver()
//             .app_data_dir()
//             .unwrap()
//             .join("folders.json");

//         let data: Data = match fs::read_to_string(&data_file) {
//             Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| {
//                 panic!("Erreur lors du parsing de folders.json");
//             }),
//             Err(_) => panic!("Impossible de lire le fichier folders.json"),
//         };

//         let folder_path = data.input;

//         let (tx, rx) = channel();

//         // Créer un watcher avec la configuration par défaut
//         let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();

//         // Convertir la String en &Path
//         let path = Path::new(&folder_path);

//         // Commence à surveiller le dossier
//         watcher.watch(path, RecursiveMode::Recursive).unwrap();

//         for event in rx {
//             if let Ok(event) = event {
//                 // Envoyer l'événement au frontend
//                 app_handle.emit_all("folder-changed", format!("{:?}", event)).unwrap();
//             }
//         }
//     });
// }

#[tauri::command]
fn start_monitoring(
    state: tauri::State<Arc<Mutex<WatcherState>>>,
    app_handle: tauri::AppHandle,
) {
  let data_file = app_handle
               .path_resolver()
               .app_data_dir()
               .unwrap()
               .join("folders.json");

  let data: Data = match fs::read_to_string(&data_file) {
                Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| {
                    panic!("Erreur lors du parsing de folders.json");
                }),
                Err(_) => panic!("Impossible de lire le fichier folders.json"),
            };
          
            let folder_path = data.input;

    let mut state = state.lock().unwrap();
    let (tx, rx) = channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();
    let path = Path::new(&folder_path);
    watcher.watch(path, RecursiveMode::Recursive).unwrap();

    state.watcher = Some(watcher);

    std::thread::spawn(move || {
      for event in rx {
          if let Ok(event) = event {
              // Filtrer uniquement les événements de création
              if let EventKind::Create(_) = event.kind {
                  app_handle
                      .emit_all("folder-changed", format!("Nouveau fichier : {:?}", event.paths))
                      .unwrap();
              }
          }
      }
  });

    println!("Surveillance démarrée sur le dossier : {}", folder_path);
}

#[tauri::command]
fn stop_monitoring(state: tauri::State<Arc<Mutex<WatcherState>>>) {
    let mut state = state.lock().unwrap();
    if let Some(watcher) = state.watcher.take() {
        drop(watcher); // Arrête le watcher en le supprimant
        println!("Surveillance arrêtée.");
    } else {
        println!("Aucun watcher actif à arrêter.");
    }
}