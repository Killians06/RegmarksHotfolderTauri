"use client";

import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useLogStore } from "@/stores/logStore";
import { useMonitoringStore } from "@/stores/monitoringStore";
import { useFolderStore } from "@/stores/folderStore"; // Importer le store des dossiers
import { useReplacementStore } from "@/stores/replacementStore";
import LogBox from "@/components/LogBox";
import { useEffect } from "react";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";

export interface ReplacementStore {
    // Other properties
    replacements: { search: string; replace: string }[]; // Ensure the replacements property is defined
}

let unlistenFolderChanged: (() => void) | null = null;
let isFolderChangedListenerActive = false; // Variable pour suivre l'état de l'écouteur

export default function Page() {
    const isFirstLoad = useMonitoringStore((state) => state.isFirstLoad);
    const setIsFirstLoad = useMonitoringStore((state) => state.setIsFirstLoad);
    const isMonitoring = useMonitoringStore((state) => state.isMonitoring);
    const setIsMonitoring = useMonitoringStore((state) => state.setIsMonitoring);
    const autoStart = useMonitoringStore((state) => state.autoStart);
    const setAutoStart = useMonitoringStore((state) => state.setAutoStart);
    const addLog = useLogStore((state) => state.addLog);
    const logs = useLogStore((state) => state.logs);
    const replacements = useReplacementStore((state) => state.replacements);

    const inputFolder = useFolderStore((state) => state.inputFolder);
    const outputFolder = useFolderStore.getState().outputFolder;

    // Démarrer la surveillance uniquement au premier chargement si autoStart est activé
    useEffect(() => {
        if (typeof window !== "undefined" && isFirstLoad && autoStart && !isMonitoring) {
            toggleMonitoring(); // Démarrer la surveillance uniquement si autoStart est activé
            setIsFirstLoad(false); // Marquer que le premier chargement est terminé
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Exécuté uniquement au premier chargement de la page

    // Arrêter la surveillance avant la fermeture de l'application
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleCloseRequest = async () => {
                if (isMonitoring) {
                    await invoke("stop_monitoring"); // Arrêter la surveillance
                    addLog(`[${new Date().toLocaleString()}] - Surveillance arrêtée avant la fermeture.`);
                    setIsMonitoring(false);
                }
                // Permettre la fermeture de l'application
                await appWindow.close();
            };

            const unlisten = appWindow.listen("tauri://close-request", handleCloseRequest);

            return () => {
                unlisten.then((fn) => fn()); // Nettoyer l'écouteur d'événements
            };
        }
    }, [isMonitoring]);

    useEffect(() => {
        return () => {
            if (unlistenFolderChanged) {
                unlistenFolderChanged();
                unlistenFolderChanged = null;
                isFolderChangedListenerActive = false; // Réinitialiser l'état de l'écouteur
            }
        };
    }, []);

    useEffect(() => {

        if (isMonitoring && inputFolder) {
            // Arrêter la surveillance actuelle
            (async () => {
                await invoke("stop_monitoring");
                addLog(`[${new Date().toLocaleString()}] - Surveillance redémarrée sur le dossier : ${inputFolder}`);
                // Démarrer la surveillance avec le nouveau dossier
                await invoke("start_monitoring", { inputFolder: inputFolder });
            })();
        }
    }, [useFolderStore((state) => state.inputFolder)]);

    const toggleMonitoring = async () => {
        if (!isMonitoring) {
            addLog(`[${new Date().toLocaleString()}] - Surveillance démarrée...`);
            setIsMonitoring(true);

            if (inputFolder) {
                try {
                    await invoke("start_monitoring", { inputFolder: inputFolder });
                    console.log("Commande start_monitoring envoyée avec :", inputFolder);
                } catch (error) {
                    console.error("Erreur lors de l'appel à start_monitoring :", error);
                }
            } else {
                console.error("Aucun dossier d'entrée sélectionné.");
            }

            // Écouter les événements de changement de dossier
            if (!isFolderChangedListenerActive) {
                isFolderChangedListenerActive = true; // Marquer l'écouteur comme actif
                unlistenFolderChanged = await listen("folder-changed", async (event) => {
                    const timestamp = new Date().toLocaleString();
                    const filePath = event.payload as string; // Chemin nettoyé reçu du backend

                    addLog(`[${timestamp}] - Nouveau fichier détecté : ${filePath}`);

                    // Traiter le fichier
                    await processFile(filePath);
                });
            }
        } else {
            const timestamp = new Date().toLocaleString();
            await invoke("stop_monitoring");
            addLog(`[${timestamp}] - Surveillance arrêtée.`);
            setIsMonitoring(false);

            // Nettoyer l'écouteur d'événements
            if (unlistenFolderChanged) {
                unlistenFolderChanged();
                unlistenFolderChanged = null;
                isFolderChangedListenerActive = false; // Marquer l'écouteur comme inactif
            }
        }
    };

    const processFile = async (filePath: string) => {
        try {
            const inputFolder = useFolderStore.getState().inputFolder;
            const outputFolder = useFolderStore.getState().outputFolder;

            if (!inputFolder || !outputFolder) {
                throw new Error("Les dossiers d'entrée et de sortie doivent être configurés.");
            }

            // Convertir les remplacements en tuples
            const replacementsTuples = replacements.map(({ search, replace }) => [search, replace]);

            // Appeler la commande backend
            const outputPath = await invoke<string>("process_file", {
                filePath,
                outputFolder,
                replacements: replacementsTuples,
            });

            console.log(`Fichier traité et enregistré : ${outputPath}`);
            addLog(`[${new Date().toLocaleString()}] - Fichier traité : ${outputPath}`);
        } catch (error) {
            console.error("Erreur lors du traitement du fichier :", error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            addLog(`[${new Date().toLocaleString()}] - Erreur : ${errorMessage}`);
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
            className="flex flex-col h-screen p-4"
        >
            {/* Checkbox pour activer/désactiver la surveillance au démarrage */}
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="autoStart"
                    checked={autoStart}
                    onChange={(e) => setAutoStart(e.target.checked)} // Met à jour uniquement l'état
                    className="w-4 h-4"
                />
                <label htmlFor="autoStart" className="text-sm text-foreground">
                    Activer la surveillance au démarrage
                </label>
            </div>

            {/* Bouton toggle */}
            <div className="mb-4">
                <button
                    onClick={toggleMonitoring}
                    className={`px-4 py-2 rounded-md text-white ${
                        isMonitoring ? "bg-red-800 hover:bg-red-900" : "bg-primary hover:bg-primary/90"
                    }`}
                >
                    {isMonitoring ? "Arrêter la surveillance" : "Démarrer la surveillance"}
                </button>
            </div>

            {/* Logbox */}
            <div className="flex-grow relative">
                <LogBox logs={logs} />
            </div>
        </motion.div>
    );
}