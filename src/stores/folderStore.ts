import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FolderState {
    inputFolder: string | null;
    outputFolder: string | null;
    setInputFolder: (folder: string | null) => void;
    setOutputFolder: (folder: string | null) => void;
}

export const useFolderStore = create<FolderState>()(
    persist(
        (set, get) => ({
            inputFolder: null, // Dossier d'entrée initial
            outputFolder: null, // Dossier de sortie initial
            setInputFolder: (folder) => {
                if (get().inputFolder !== folder) {
                    set({ inputFolder: folder });
                    console.log(`[${new Date().toLocaleString()}] - Dossier d'entrée mis à jour : ${folder}`);
                }
            },
            setOutputFolder: (folder) => {
                if (get().outputFolder !== folder) {
                    set({ outputFolder: folder });
                    console.log(`[${new Date().toLocaleString()}] - Dossier de sortie mis à jour : ${folder}`);
                }
            },
        }),
        {
            name: "folder-settings", // Nom de la clé dans localStorage ou BaseDirectory.App
        }
    )
);