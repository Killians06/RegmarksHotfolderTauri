"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { open } from "@tauri-apps/api/dialog";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useLogStore } from "@/stores/logStore"; // Importer le store des logs

export default function FolderConfigPage() {
    const [inputFolder, setInputFolder] = useState<string | null>(null);
    const [outputFolder, setOutputFolder] = useState<string | null>(null);
    const addLog = useLogStore((state) => state.addLog); // Utiliser la méthode pour ajouter un log

    // Charger les dossiers depuis un fichier JSON
    useEffect(() => {
        const loadFolders = async () => {
            try {
                const fileData = await readTextFile("folders.json", { dir: BaseDirectory.App });
                const { input, output } = JSON.parse(fileData);
                setInputFolder(input);
                setOutputFolder(output);
            } catch (error) {
                console.error("Erreur lors du chargement des dossiers :", error);
            }
        };
        loadFolders();
    }, []);

    // Sauvegarder les dossiers dans un fichier JSON
    const saveFolders = async (input: string | null, output: string | null) => {
        try {
            const folderData = { input, output };
            await writeTextFile("folders.json", JSON.stringify(folderData, null, 2), {
                dir: BaseDirectory.App,
            });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des dossiers :", error);
        }
    };

    const handleSelectInputFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Sélectionnez un dossier d'entrée",
        });
        if (typeof selected === "string") {
            setInputFolder(selected);
            saveFolders(selected, outputFolder); // Sauvegarder le dossier sélectionné
            addLog(`[${new Date().toLocaleString()}] - Dossier d'entrée sélectionné : ${selected}`); // Ajouter un log
        }
    };

    const handleSelectOutputFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Sélectionnez un dossier de sortie",
        });
        if (typeof selected === "string") {
            setOutputFolder(selected);
            saveFolders(inputFolder, selected); // Sauvegarder le dossier sélectionné
            addLog(`[${new Date().toLocaleString()}] - Dossier de sortie sélectionné : ${selected}`); // Ajouter un log
        }
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
            </div>
        </motion.div>
    );
}