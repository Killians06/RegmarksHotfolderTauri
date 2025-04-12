"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { appDataDir } from "@tauri-apps/api/path";


export default function Page() {

    
    const [data, setData] = useState([
        { id: 1, original: "Bonjour", replacement: "Hello" },
        { id: 2, original: "Au revoir", replacement: "Goodbye" },
        { id: 3, original: "Merci", replacement: "Thank you" },
    ]);

    const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);

    const ensureDataFileExists = async () => {
        try {
            // Vérifier si le fichier existe
            await readTextFile("data.json", { dir: BaseDirectory.App });
        } catch (error) {
            // Si le fichier n'existe pas, le créer avec un contenu par défaut
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

    // Charger les données depuis le fichier JSON
    useEffect(() => {
        const initializeDataFile = async () => {
            await ensureDataFileExists(); // Vérifier et créer le fichier si nécessaire
            loadData(); // Charger les données depuis le fichier
        };
        initializeDataFile();
    }, []);
    

    // Sauvegarder les données dans un fichier JSON
    const saveData = async (updatedData: typeof data) => {
        try {
            await writeTextFile("data.json", JSON.stringify(updatedData, null, 2), {
                dir: BaseDirectory.App,
            });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des données :", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number, field: string) => {
        if (e.key === "Tab") {
            e.preventDefault(); // Empêche le comportement par défaut de Tab
            if (field === "original") {
                setEditingCell({ id, field: "replacement" }); // Passe à la colonne suivante
            } else if (field === "replacement") {
                const nextRow = data.find((row) => row.id === id + 1);
                if (nextRow) {
                    setEditingCell({ id: nextRow.id, field: "original" }); // Passe à la ligne suivante
                } else {
                    handleAddRow(); // Ajoute une nouvelle ligne si on est à la dernière
                    setEditingCell({ id: id + 1, field: "original" });
                }
            }
        } else if (e.key === "Enter") {
            setEditingCell(null); // Sort du mode édition
        }
    };

    const handleInputChange = (id: number, field: string, value: string) => {
        const updatedData = data.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setData(updatedData);
        saveData(updatedData); // Sauvegarder les données après modification
    };

    const handleCellClick = (id: number, field: string) => {
        setEditingCell({ id, field });
    };

    const handleBlur = () => {
        // Vérifier si une ligne est vide
        const filteredData = data.filter((row) => row.original.trim() !== "" || row.replacement.trim() !== "");
        if (filteredData.length !== data.length) {
            setData(filteredData);
            saveData(filteredData); // Sauvegarder les données après suppression
        }
        setEditingCell(null);
    };

    const handleAddRow = () => {
        const newRow = {
            id: data.length + 1,
            original: "",
            replacement: "",
        };
        setData([...data, newRow]);
        saveData([...data, newRow]); // Sauvegarder les données après ajout
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
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="table-auto w-full border-collapse bg-card shadow-lg rounded-lg">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="border border-border px-6 py-3 text-left font-semibold">
                                Chaîne originale
                            </th>
                            <th className="border border-border px-6 py-3 text-left font-semibold">
                                Chaîne de remplacement
                            </th>
                        </tr>
                    </thead>
                    <tbody>
    {data.map((row, index) => (
        <tr
            key={row.id}
            className={`${
                index % 2 === 0 ? "bg-muted" : "bg-card"
            } hover:bg-accent`}
        >
            <td
    className="border border-border px-6 py-3 cursor-pointer w-1/2"
    onClick={() => handleCellClick(row.id, "original")}
    style={{ height: "50px" }}
>
    {editingCell?.id === row.id && editingCell.field === "original" ? (
        <input
            type="text"
            value={row.original}
            onChange={(e) => handleInputChange(row.id, "original", e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, row.id, "original")}
            autoFocus
            className="w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            style={{
                height: "100%",
            }}
        />
    ) : (
        <span className="block w-full text-foreground">{row.original}</span>
    )}
</td>
<td
    className="border border-border px-6 py-3 cursor-pointer w-1/2"
    onClick={() => handleCellClick(row.id, "replacement")}
    style={{ height: "50px" }}
>
    {editingCell?.id === row.id && editingCell.field === "replacement" ? (
        <input
            type="text"
            value={row.replacement}
            onChange={(e) => handleInputChange(row.id, "replacement", e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, row.id, "replacement")}
            autoFocus
            className="w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            style={{
                height: "100%",
            }}
        />
    ) : (
        <span className="block w-full text-foreground">{row.replacement}</span>
    )}
</td>
        </tr>
    ))}
    <tr
        className="bg-muted hover:bg-accent cursor-pointer"
        onClick={handleAddRow}
    >
        <td
            colSpan={2}
            className="border border-border px-6 py-3 text-center text-gray-500"
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