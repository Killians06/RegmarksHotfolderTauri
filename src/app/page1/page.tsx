"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLogStore } from "@/stores/logStore"; // Importer le store des logs
import { useReplacementStore } from "@/stores/replacementStore"; // Importer le store des remplacements
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PickerExample } from "@/components/custom/ColorPicker";
import { DarkModeSelector } from "@/components/custom/DarkModeSelector";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Settings } from "lucide-react";

export default function Page() {
    const addLog = useLogStore((state) => state.addLog); // Assurez-vous que cette fonction est stable
    const replacements = useReplacementStore((state) => state.replacements); // Récupérer les remplacements depuis le store
    const addReplacement = useReplacementStore((state) => state.addReplacement); // Ajouter une ligne
    const updateReplacement = useReplacementStore((state) => state.updateReplacement); // Mettre à jour une ligne
    const deleteReplacement = useReplacementStore((state) => state.deleteReplacement); // Supprimer une ligne

    const [tempValue, setTempValue] = useState<string>(""); // Valeur temporaire pour l'édition
    const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);

    const handleInputChange = (id: number, field: string, value: string) => {
        updateReplacement(id, field, value); // Mettre à jour la ligne dans le store
    };

    const handleAddRow = () => {
        addReplacement(); // Ajouter une nouvelle ligne dans le store
    };

    const handleDeleteRow = (id: number) => {
        deleteReplacement(id); // Supprimer la ligne dans le store
    };

    const handleBlur = (id: number, field: string) => {
        if (tempValue.trim() !== "") {
            updateReplacement(id, field, tempValue); // Mettre à jour la valeur dans le store
        }
        setTempValue(""); // Réinitialiser la valeur temporaire
        setEditingCell(null); // Quitter le mode édition
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number, field: string) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault(); // Empêcher le comportement par défaut de la touche "Entrée"

            // Sauvegarder la valeur actuelle avant de passer à la cellule suivante
            handleBlur(id, field);

            // Passer à la cellule suivante
            if (field === "search") {
                setEditingCell({ id, field: "replace" });
                const currentRow = replacements.find((row) => row.id === id);
                if (currentRow) {
                    setTempValue(currentRow?.replace || ""); // Initialiser avec la valeur de la cellule suivante
                }
            } else if (field === "replace") {
                // Si c'est la dernière cellule de la ligne, passer à la ligne suivante
                const nextRow = replacements.find((row) => row.id === id + 1);
                if (nextRow) {
                    setEditingCell({ id: nextRow.id, field: "search" });
                    setTempValue(nextRow.search); // Initialiser avec la valeur de la cellule suivante
                } else {
                    // Si c'est la dernière ligne, ajouter une nouvelle ligne
                    handleAddRow();
                }
            }
        }
    };

    useEffect(() => {
        console.log("useEffect triggered for replacements summary");

        return () => {
            // Formater les paires de remplacement
            const replacementSummary = replacements
                .map((row) => `${row.search} -> ${row.replace}`)
                .join("\n");

            // Ajouter le résumé dans la logbox
            if (replacementSummary) {
                addLog(`[${new Date().toLocaleString()}] - Résumé des remplacements :\n${replacementSummary}`);
            }
        };
    }, [replacements]); // Supprimez `addLog` des dépendances si elle ne change pas

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
            <h1 className="text-2xl mb-8 text-foreground">Tableau de Remplacements</h1>

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="table-auto w-full border-collapse bg-card shadow-lg rounded-lg">
                    <thead className="bg-muted text-primary text-lg font-semibold">
                        <tr>
                            <th className="border border-border px-6 py-3 text-left font-semibold">
                                Chaîne originale
                            </th>
                            <th className="border border-border px-6 py-3 text-left font-semibold">
                                Chaîne de remplacement
                            </th>
                            <th className="border border-border px-6 py-3 text-center font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {replacements.map((row, index) => (
                            <tr
                                key={row.id}
                                className={`${
                                    index % 2 === 0 ? "bg-card" : "bg-muted"
                                } hover:bg-primary`}
                            >
                                <td
                                    className="border border-border px-6 py-3 cursor-pointer w-1/2"
                                    onClick={() => {
                                        setEditingCell({ id: row.id, field: "search" });
                                        setTempValue(row.search); // Initialiser la valeur temporaire
                                    }}
                                >
                                    {editingCell?.id === row.id && editingCell.field === "search" ? (
                                        <input
                                            type="text"
                                            value={tempValue} // Utiliser la valeur temporaire
                                            onChange={(e) => setTempValue(e.target.value)} // Mettre à jour la valeur temporaire
                                            onBlur={() => handleBlur(row.id, "search")} // Sauvegarder lors du blur
                                            onKeyDown={(e) => handleKeyDown(e, row.id, "search")} // Gérer la touche "Entrée"
                                            autoFocus
                                            className="w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    ) : (
                                        <span className="block w-full text-foreground">{row.search}</span>
                                    )}
                                </td>
                                <td
                                    className="border border-border px-6 py-3 cursor-pointer w-1/2"
                                    onClick={() => setEditingCell({ id: row.id, field: "replace" })}
                                >
                                    {editingCell?.id === row.id && editingCell.field === "replace" ? (
                                        <input
                                            type="text"
                                            value={tempValue} // Utiliser la valeur temporaire
                                            onChange={(e) => setTempValue(e.target.value)} // Mettre à jour la valeur temporaire
                                            onBlur={() => handleBlur(row.id, "replace")} // Sauvegarder lors du blur
                                            onKeyDown={(e) => handleKeyDown(e, row.id, "replace")} // Gérer la touche "Entrée"
                                            autoFocus
                                            className="w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    ) : (
                                        <span className="block w-full text-foreground">{row.replace}</span>
                                    )}
                                </td>
                                <td className="border border-border px-6 py-3 text-center">
                                    <button
                                        onClick={() => handleDeleteRow(row.id)} // Supprimer la ligne
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr
                            className={`${
                                replacements.length % 2 === 0 ? "bg-card" : "bg-muted"
                            } hover:bg-primary/60 cursor-pointer`}
                            onClick={handleAddRow}
                        >
                            <td
                                colSpan={3}
                                className="border border-border px-6 py-3 text-center text-white/70 hover:text-white"
                            >
                                + Ajouter une nouvelle ligne
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}