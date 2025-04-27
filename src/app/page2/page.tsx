"use client";
import { motion } from "framer-motion";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { useFolderStore } from "@/stores/folderStore"; // Importer le store des dossiers
import { useLogStore } from "@/stores/logStore"; // Importer le store des logs
import { useRef, useEffect } from "react";

export default function FolderConfigPage() {
    const inputFolder = useFolderStore((state) => state.inputFolder);
    const outputFolder = useFolderStore((state) => state.outputFolder);
    const setInputFolder = useFolderStore((state) => state.setInputFolder);
    const setOutputFolder = useFolderStore((state) => state.setOutputFolder);
    const addLog = useLogStore((state) => state.addLog);


    useEffect(() => {
        if (inputFolder && outputFolder) {
            invoke("update_folders", { inputFolder, outputFolder });
        }
    }, [inputFolder, outputFolder]);

    const handleSelectInputFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Sélectionnez un dossier d'entrée",
        });
        if (typeof selected === "string") {
            setInputFolder(selected); // Mettre à jour le store
            // addLog(`[${new Date().toLocaleString()}] - Dossier d'entrée sélectionné : ${selected}`);
        }
    };

    const handleSelectOutputFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Sélectionnez un dossier de sortie",
        });
        if (typeof selected === "string") {
            setOutputFolder(selected); // Mettre à jour le store
            // addLog(`[${new Date().toLocaleString()}] - Dossier de sortie sélectionné : ${selected}`);
        }
    };

    const handleResetFolders = () => {
        setInputFolder(null); // Réinitialiser le dossier d'entrée
        setOutputFolder(null); // Réinitialiser le dossier de sortie
        addLog(`[${new Date().toLocaleString()}] - Les dossiers ont été réinitialisés.`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            className="flex min-h-screen flex-col items-center justify-center p-6 bg-background"
        >
            <h1 className="text-2xl mb-8 text-foreground">Configuration des Dossiers</h1>
            <div className="flex flex-col gap-6 w-full max-w-lg bg-card p-6 rounded-lg shadow-md">
                <div>
                    <button
                        onClick={handleSelectInputFolder}
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Sélectionner le dossier d&apos;entrée
                    </button>
                    {inputFolder && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            Dossier d&apos;entrée : <span className="text-foreground">{inputFolder}</span>
                        </p>
                    )}
                </div>
                <div>
                    <button
                        onClick={handleSelectOutputFolder}
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Sélectionner le dossier de sortie
                    </button>
                    {outputFolder && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            Dossier de sortie : <span className="text-foreground">{outputFolder}</span>
                        </p>
                    )}
                </div>
                <div>
                    <button
                        onClick={handleResetFolders}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Réinitialiser les dossiers
                    </button>
                </div>
            </div>
        </motion.div>
    );
}