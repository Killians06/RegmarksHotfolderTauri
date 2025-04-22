"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

export default function Page() {
    
    const [tempValue, setTempValue] = useState<string>(""); // Valeur temporaire pour l'édition
    
    const [data, setData] = useState([
        { id: 1, original: "Bonjour", replacement: "Hello" },
        { id: 2, original: "Au revoir", replacement: "Goodbye" },
        { id: 3, original: "Merci", replacement: "Thank you" },
    ]);

    const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);

    const ensureDataFileExists = async () => {
        try {
            await readTextFile("data.json", { dir: BaseDirectory.App });
        } catch (error) {
            const defaultData = [
                { id: 1, original: "Register", replacement: "Mark" },
                { id: 2, original: "CutContour", replacement: "Cut" },
            ];
            await writeTextFile("data.json", JSON.stringify(defaultData, null, 2), {
                dir: BaseDirectory.App,
            });
            console.log("Fichier data.json créé avec des données par défaut.");
        }
    };

    const loadData = async () => {
        try {
            const fileData = await readTextFile("data.json", { dir: BaseDirectory.App });
            setData(JSON.parse(fileData));
            console.log("Données chargées :", JSON.parse(fileData));
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    };

    useEffect(() => {
        const initializeDataFile = async () => {
            await ensureDataFileExists();
            loadData();
        };
        initializeDataFile();
    }, []);

    const saveData = async (updatedData: typeof data) => {
        try {
            // Filtrer les lignes où les deux champs sont vides
            const filteredData = updatedData.filter(
                (row) => row.original.trim() !== "" || row.replacement.trim() !== ""
            );

            await writeTextFile("data.json", JSON.stringify(filteredData, null, 2), {
                dir: BaseDirectory.App,
            });

            setData(filteredData); // Mettre à jour l'état local avec les données filtrées
            console.log("Données sauvegardées !");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des données :", error);
        }
    };

    const handleInputChange = (id: number, field: string, value: string) => {
        const updatedData = data.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setData(updatedData); // Mettre à jour les données localement
    };

    const handleAddRow = () => {
        const newRow = {
            id: data.length + 1, // Générer un nouvel ID
            original: "", // Champ vide
            replacement: "", // Champ vide
        };
        const updatedData = [...data, newRow];
        setData(updatedData); // Mettre à jour les données localement

        // Rendre la première cellule de la nouvelle ligne éditable
        setEditingCell({ id: newRow.id, field: "original" });
    };

    const handleDeleteRow = (id: number) => {
        const updatedData = data.filter((row) => row.id !== id); // Supprimer la ligne avec l'ID donné
        setData(updatedData); // Mettre à jour les données localement
    };

    const handleBlur = (id: number, field: string) => {
        // Vérifier si une valeur temporaire existe avant de mettre à jour
        if (tempValue.trim() !== "") {
            const updatedData = data.map((row) =>
                row.id === id ? { ...row, [field]: tempValue } : row
            );
            setData(updatedData); // Mettre à jour les données localement
        }
        setTempValue(""); // Réinitialiser la valeur temporaire
        setEditingCell(null); // Quitter le mode édition
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number, field: string) => {
        if (e.key === "Enter" ||  e.key === "Tab") {
            e.preventDefault(); // Empêcher le comportement par défaut de la touche "Entrée"
    
            // Sauvegarder la valeur actuelle avant de passer à la cellule suivante
            handleBlur(id, field);
    
            // Passer à la cellule suivante
            if (field === "original") {
                setEditingCell({ id, field: "replacement" });
                const currentRow = data.find((row) => row.id === id);
                if (currentRow) {
                    setTempValue(currentRow.replacement); // Initialiser avec la valeur de la cellule suivante
                }
            } else if (field === "replacement") {
                // Si c'est la dernière cellule de la ligne, passer à la ligne suivante
                const nextRow = data.find((row) => row.id === id + 1);
                if (nextRow) {
                    setEditingCell({ id: nextRow.id, field: "original" });
                    setTempValue(nextRow.original); // Initialiser avec la valeur de la cellule suivante
                } else {
                    // Si c'est la dernière ligne, ajouter une nouvelle ligne
                    handleAddRow();
                }
            }
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
            className="flex min-h-screen flex-col items-center justify-center p-6 bg-background"
        >
            <h1 className="text-2xl mb-8 text-foreground">Tableau de Remplacements</h1>
            
            {/* Bouton pour sauvegarder */}
            <div className="mb-4">
                <button
                    onClick={() => saveData(data)} // Sauvegarder les données actuelles
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                    Sauvegarder le tableau
                </button>
            </div>

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
                        {data.map((row, index) => (
                            <tr
                                key={row.id}
                                className={`${
                                    index % 2 === 0 ? "bg-card" : "bg-muted"
                                } hover:bg-primary`}
                            >
                                <td
                                    className="border border-border px-6 py-3 cursor-pointer w-1/2"
                                    onClick={() => {
                                        setEditingCell({ id: row.id, field: "original" });
                                        setTempValue(row.original); // Initialiser la valeur temporaire
                                    }}
                                >
                                    {editingCell?.id === row.id && editingCell.field === "original" ? (
                                        <input
                                            type="text"
                                            value={tempValue} // Utiliser la valeur temporaire
                                            onChange={(e) => setTempValue(e.target.value)} // Mettre à jour la valeur temporaire
                                            onBlur={() => handleBlur(row.id, "original")} // Sauvegarder lors du blur
                                            onKeyDown={(e) => handleKeyDown(e, row.id, "original")} // Gérer la touche "Entrée"
                                            autoFocus
                                            className="w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    ) : (
                                        <span className="block w-full text-foreground">{row.original}</span>
                                    )}
                                </td>
                                <td
                                    className="border border-border px-6 py-3 cursor-pointer w-1/2"
                                    onClick={() => setEditingCell({ id: row.id, field: "replacement" })}
                                >
                                    {editingCell?.id === row.id && editingCell.field === "replacement" ? (
                                        <input
                                            type="text"
                                            value={tempValue} // Utiliser la valeur temporaire
                                            onChange={(e) => setTempValue(e.target.value)} // Mettre à jour la valeur temporaire
                                            onBlur={() => handleBlur(row.id, "replacement")} // Sauvegarder lors du blur
                                            onKeyDown={(e) => handleKeyDown(e, row.id, "replacement")} // Gérer la touche "Entrée"
                                            autoFocus
                                            className="w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    ) : (
                                        <span className="block w-full text-foreground">{row.replacement}</span>
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
                                data.length % 2 === 0 ? "bg-card" : "bg-muted"
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