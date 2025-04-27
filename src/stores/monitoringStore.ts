import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MonitoringState {
    isMonitoring: boolean;
    autoStart: boolean;
    setIsMonitoring: (state: boolean) => void;
    setAutoStart: (state: boolean) => void;
}

export const useMonitoringStore = create<MonitoringState>()(
    persist(
        (set) => ({
            isMonitoring: false, // État initial de la surveillance
            autoStart: false, // État initial de la checkbox
            setIsMonitoring: (state) => set({ isMonitoring: state }),
            setAutoStart: (state) => set({ autoStart: state }),
        }),
        {
            name: "monitoring-settings", // Nom de la clé dans localStorage
        }
    )
);