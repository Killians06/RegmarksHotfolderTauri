import { create } from "zustand";

interface Replacement {
    id: number;
    search: string;
    replace: string;
}

interface ReplacementStore {
    replacements: Replacement[];
    setReplacements: (newReplacements: Replacement[]) => void;
    addReplacement: () => void;
    updateReplacement: (id: number, field: string, value: string) => void;
    deleteReplacement: (id: number) => void;
}

// Charger les données depuis le localStorage
const loadReplacements = (): Replacement[] => {
    const storedData = localStorage.getItem("replacements");
    return storedData ? JSON.parse(storedData) : [];
};

// Sauvegarder les données dans le localStorage
const saveReplacements = (replacements: Replacement[]) => {
    localStorage.setItem("replacements", JSON.stringify(replacements));
};

export const useReplacementStore = create<ReplacementStore>((set) => ({
    replacements: loadReplacements(), // Charger les données au démarrage
    setReplacements: (newReplacements) => {
        saveReplacements(newReplacements); // Sauvegarder dans le localStorage
        set({ replacements: newReplacements });
    },
    addReplacement: () =>
        set((state) => {
            const newReplacements = [
                ...state.replacements,
                { id: state.replacements.length + 1, search: "", replace: "" },
            ];
            saveReplacements(newReplacements); // Sauvegarder dans le localStorage
            return { replacements: newReplacements };
        }),
    updateReplacement: (id, field, value) =>
        set((state) => {
            const newReplacements = state.replacements.map((replacement) =>
                replacement.id === id ? { ...replacement, [field]: value } : replacement
            );
            saveReplacements(newReplacements); // Sauvegarder dans le localStorage
            return { replacements: newReplacements };
        }),
    deleteReplacement: (id) =>
        set((state) => {
            const newReplacements = state.replacements.filter((replacement) => replacement.id !== id);
            saveReplacements(newReplacements); // Sauvegarder dans le localStorage
            return { replacements: newReplacements };
        }),
}));