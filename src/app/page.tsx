"use client";

import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useLogStore } from "@/stores/logStore";
import { useMonitoringStore } from "@/stores/monitoringStore";
import LogBox from "@/components/LogBox";
import { useEffect } from "react";

export default function Page() {
    const isMonitoring = useMonitoringStore((state) => state.isMonitoring);
    const setIsMonitoring = useMonitoringStore((state) => state.setIsMonitoring);
    const autoStart = useMonitoringStore((state) => state.autoStart);
    const setAutoStart = useMonitoringStore((state) => state.setAutoStart);
    const addLog = useLogStore((state) => state.addLog);
    const logs = useLogStore((state) => state.logs);

    // Démarrer la surveillance au chargement si autoStart est activé
    useEffect(() => {
        if (autoStart && !isMonitoring) {
            toggleMonitoring(); // Démarrer la surveillance uniquement si autoStart est activé
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Exécuté uniquement au chargement de la page

    const toggleMonitoring = async () => {
        if (!isMonitoring) {
            addLog(`[${new Date().toLocaleString()}] - Surveillance démarrée...`);
            setIsMonitoring(true);

            // Appeler la commande backend pour commencer la surveillance
            await invoke("start_monitoring", { folderPath: "path/to/folder" });

            // Écouter les événements de changement de dossier
            listen("folder-changed", (event) => {
                const timestamp = new Date().toLocaleString();
                addLog(`[${timestamp}] - Changement détecté : ${event.payload}`);
            });
        } else {
            const timestamp = new Date().toLocaleString();
            await invoke("stop_monitoring");
            addLog(`[${timestamp}] - Surveillance arrêtée.`);
            setIsMonitoring(false);
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