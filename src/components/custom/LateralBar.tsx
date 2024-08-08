"use client";

import style from "./LateralBar.module.css";
import { Home, Circle } from "lucide-react";
import Link from "next/link";
import { X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export const LateralBar = () => {
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
        <div
            className={`bg-primary flex flex-col rounded-l-lg min-h-full w-12  hover:w-52 duration-300 fixed left group ${style.container}`}
        >
            <div className="flex flex-col items-start justify-center h-full px-3 duration-300 group-hover:px-3">
                <div>
                    <Button variant="ghost" size="menuButton" onClick={close}>
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
                <ul className="py-5 flex flex-col gap-5 justify-center">
                    <li>
                        <Link className="flex gap-2" href="/">
                            <Home />
                            <p className="whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300">
                                Home
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link className="flex gap-2" href="/page1">
                            <Circle />
                            <p className="whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300">
                                Page 1
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link className="flex gap-2" href="/page2">
                            <Circle />
                            <p className="whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300">
                                Page 2
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link className="flex gap-2" href="/page3">
                            <Circle />
                            <p className="whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300">
                                Page 3
                            </p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};
