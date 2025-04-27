import { X, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useMonitoringStore } from "@/stores/monitoringStore";
import { useLogStore } from "@/stores/logStore";

export const ControlMenu = () => {
    const [appWindow, setAppWindow] = useState<WebviewWindow>();

    const isMonitoring = useMonitoringStore((state) => state.isMonitoring);
    const setIsMonitoring = useMonitoringStore((state) => state.setIsMonitoring);
    const setIsFirstLoad = useMonitoringStore((state) => state.setIsFirstLoad); // Ajouter setIsFirstLoad
    const addLog = useLogStore((state) => state.addLog);

    async function setupAppWindow() {
        const appWindow = (await import("@tauri-apps/api/window")).appWindow;
        setAppWindow(appWindow);
    }

    useEffect(() => {
        setupAppWindow();
    }, []);

    const minimize = async () => await appWindow?.minimize();

    const close = async () => {
        // Arrêter la surveillance avant de fermer l'application
        if (isMonitoring) {
            await (await import("@tauri-apps/api/tauri")).invoke("stop_monitoring");
            addLog(`[${new Date().toLocaleString()}] - Surveillance arrêtée avant la fermeture.`);
            setIsMonitoring(false);
        }

        // Réinitialiser isFirstLoad pour le prochain démarrage
        setIsFirstLoad(true);

        // Attendre 5 secondes avant de fermer l'application
        addLog(`[${new Date().toLocaleString()}] - Fermeture de l'application dans 2.5 secondes...`);
        setTimeout(async () => {
            await appWindow?.close();
        }, 2500); // 5000 ms = 5 secondes
    };

    return (
        <div className="absolute right-4 top-4 flex gap-3">
            <Button variant="ghost" size="menuButton" onClick={minimize}>
                <Minus />
            </Button>
            <Button
                variant="ghost"
                size="menuButton"
                className="hover:bg-red-700 hover:text-white"
                onClick={close}
            >
                <X />
            </Button>
        </div>
    );
};
