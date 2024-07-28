"use client";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

import { X, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

export const CustomMenu = () => {
    const [appWindow, setAppWindow] = useState<WebviewWindow>();

    async function setupAppWindow() {
        const appWindow = (await import("@tauri-apps/api/window")).appWindow;
        setAppWindow(appWindow);
    }

    const minimize = async () => await appWindow?.minimize();
    const close = async () => await appWindow?.close();

    useEffect(() => {
        setupAppWindow();
    }, []);

    return (
        <>
            { appWindow ? (
                <div className="static">
                    <div className="absolute left-5 top-5 flex gap-2">
                        <Button variant="ghost" size="menuButton" onClick={close}>
                            <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="menuButton" onClick={minimize}>
                            <Minus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : null }
        </>
    );
};
