import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MonitoringState {
    isMonitoring: boolean;
    autoStart: boolean;
    isFirstLoad: boolean;
    setIsMonitoring: (state: boolean) => void;
    setAutoStart: (state: boolean) => void;
    setIsFirstLoad: (state: boolean) => void;
}

export const useMonitoringStore = create<MonitoringState>()(
    persist(
        (set) => ({
            isMonitoring: false, // État initial de la surveillance
            autoStart: false, // État initial de la checkbox
            isFirstLoad: true, // Initialisé à true au démarrage
            setIsMonitoring: (state) => set({ isMonitoring: state }),
            setAutoStart: (state) => set({ autoStart: state }),
            setIsFirstLoad: (state) => set({ isFirstLoad: state }),
        }),
        {
            name: "monitoring-settings", // Nom de la clé dans localStorage
        }
    )
);