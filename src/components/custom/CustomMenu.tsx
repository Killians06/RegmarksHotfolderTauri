"use client";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

import { X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
//CI TEST

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
            {appWindow ? (
                <div className="static">
                    <div
                        className="absolute left-0 top-0 flex gap-2 w-full h-content p-5"
                        data-tauri-drag-region
                    >
                        <Button
                            variant="ghost"
                            size="menuButton"
                            onClick={close}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="menuButton"
                            onClick={minimize}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : null}
        </>
    );
};
