"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Page() {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [logs, setLogs] = useState<string[]>([]); // Stocker les logs

    const toggleMonitoring = () => {
        setIsMonitoring((prev) => !prev);
        if (!isMonitoring) {
            setLogs((prevLogs) => [...prevLogs, "Surveillance démarrée..."]);
        } else {
            setLogs((prevLogs) => [...prevLogs, "Surveillance arrêtée."]);
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
                <div className="absolute bottom-0 left-0 w-full h-1/2 mx-auto bg-gray-100 border-t border-gray-300 overflow-y-auto p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-2">Logs</h2>
                    <div className="space-y-2">
                        {logs.map((log, index) => (
                            <p key={index} className="text-sm text-gray-700">
                                {log}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}