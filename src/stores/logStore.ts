import { create } from "zustand";

interface LogStore {
    logs: string[];
    addLog: (log: string) => void;
    clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
    logs: [],
    addLog: (log) =>
        set((state) => {
            if (!state.logs.includes(log)) {
                return { logs: [...state.logs, log] };
            }
            return state; // Ne rien faire si le log existe déjà
        }),
    clearLogs: () => set({ logs: [] }),
}));