"use client";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

import { X, Minus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotPattern } from "./DotEffect";
import { DarkModeSelector } from "./DarkModeSelector";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
                    <div className="absolute left-0 top-0 grid grid-cols-12 w-full h-20 p-5">
                        <div className="flex gap-2 col-span-1 items-center">
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
                        <div className="col-span-10 p-4" data-tauri-drag-region>
                            <DotPattern rows={1} dotsPerRow={200} />
                        </div>
                        <div className="col-span-1 flex justify-end items-center">
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="ghost" size="menuButton">
                                        <Settings />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Settings</DialogTitle>
                                    <DialogDescription>
                                        <ul>
                                            <li className="flex items-center gap-5 text-foreground">
                                                DarkMode : <DarkModeSelector />
                                            </li>
                                        </ul>
                                    </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
