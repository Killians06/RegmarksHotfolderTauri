"use client";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

import { X, Minus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotPattern } from "./DotEffect";
import { DarkModeSelector } from "./DarkModeSelector";
import { DraggableRegion } from "@/components/custom/DraggableRegion";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
                    <div className="px-4 pt-3 grid grid-cols-4 text-foreground">
                        <div className="flex gap-2 items-center col-span-1">
                            <Button
                                variant="ghost"
                                size="menuButton"
                                onClick={close}
                            >
                                <X />
                            </Button>
                            <Button
                                variant="ghost"
                                size="menuButton"
                                onClick={minimize}
                            >
                                <Minus />
                            </Button>
                        </div>
                        <div className="flex items-center col-span-10 px-4 col-span-3" data-tauri-drag-region>
                            <DraggableRegion>
                                <DotPattern rows={3} dotsPerRow={40} />
                            </DraggableRegion>
                        </div>
                    </div>
            ) : null}
        </>
    );
};
