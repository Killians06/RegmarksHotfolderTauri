"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useLogStore } from "@/stores/logStore";
import LogBox from "@/components/LogBox";

export default function Page() {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const addLog = useLogStore((state) => state.addLog);
    const logs = useLogStore((state) => state.logs);

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