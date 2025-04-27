// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use notify::{EventKind, RecommendedWatcher, RecursiveMode, Watcher, Config};
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


fn main() {
    tauri::Builder::default()
        .menu(create_menu())
        .on_menu_event(|event| handle_menu_event(&event.window(), event.menu_item_id()))
        .manage(Arc::new(Mutex::new(WatcherState::default())))
        .invoke_handler(tauri::generate_handler![
            start_monitoring,
            stop_monitoring,
            process_file,
            update_folders // Ajout de la commande ici
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn start_monitoring(
    input_folder: String, // Recevoir le dossier d'entrée en paramètre
    state: tauri::State<Arc<Mutex<WatcherState>>>,
    app_handle: tauri::AppHandle,
) {
    let mut state = state.lock().unwrap();
    let (tx, rx) = channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();
    let path = Path::new(&input_folder);
    watcher.watch(path, RecursiveMode::NonRecursive).unwrap();

    state.watcher = Some(watcher);

    std::thread::spawn(move || {
        for event in rx {
            if let Ok(event) = event {
                if let EventKind::Create(_) = event.kind {
                    for path in event.paths {
                        let cleaned_path = path.to_string_lossy().to_string();
                        app_handle
                            .emit_all("folder-changed", cleaned_path)
                            .unwrap();
                    }
                }
            }
        }
    });

    println!("Surveillance démarrée sur le dossier : {}", input_folder);
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

#[tauri::command]
fn process_file(file_path: String, output_folder: String, replacements: Vec<(String, String)>) -> Result<String, String> {
    // Lire le contenu du fichier
    let content = fs::read_to_string(&file_path).map_err(|e| format!("Erreur de lecture du fichier : {}", e))?;

    // Appliquer les remplacements
    let mut modified_content = content;
    for (search, replace) in replacements {
        modified_content = modified_content.replace(&search, &replace);
    }

    // Déterminer le chemin du fichier de sortie avec le suffixe "_processed"
    let file_name = Path::new(&file_path)
        .file_name()
        .ok_or("Nom de fichier introuvable")?
        .to_str()
        .ok_or("Nom de fichier invalide")?;

    // Ajouter le suffixe "_processed" avant l'extension
    let processed_file_name = if let Some((name, ext)) = file_name.rsplit_once('.') {
        format!("{}_processed.{}", name, ext)
    } else {
        format!("{}_processed", file_name) // Si le fichier n'a pas d'extension
    };

    let output_path = Path::new(&output_folder).join(processed_file_name);

    // Écrire le fichier modifié
    fs::write(&output_path, modified_content).map_err(|e| format!("Erreur d'écriture du fichier : {}", e))?;

    Ok(output_path.to_string_lossy().to_string())
}

#[tauri::command]
fn update_folders(input_folder: String, output_folder: String) {
    println!(
        "Dossiers mis à jour : inputFolder = {}, outputFolder = {}",
        input_folder, output_folder
    );
    // Vous pouvez stocker ces valeurs dans une structure globale ou les utiliser directement
}