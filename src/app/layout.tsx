"use client";

import { useState, useEffect } from "react";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { Suspense } from "react";
import { WebviewWindow } from "@tauri-apps/api/window";

import Link from "next/link";

import {
    Home,
    Package,
    Settings,
    ShoppingCart,
    Users,
    X,
    Minus,
    Maximize2,
    Minimize2,
} from "lucide-react";

import { DarkModeSelector } from "@/components/custom/DarkModeSelector";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { CustomMenu } from "@/components/custom/CustomMenu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [fullWidth, setFullWidth] = useState(false);
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
        <html lang="en" suppressHydrationWarning className="static min-w-full">
            <head />
            <body
                className={cn(
                    "min-h-screen font-sans antialiased",
                    fontSans.variable
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <Suspense fallback={<p>Loading ... </p>}>
                        <div className="absolute right-4 top-4 flex gap-3">
                            <Button
                                variant="ghost"
                                size="menuButton"
                                onClick={minimize}
                            >
                                <Minus />
                            </Button>
                            <Button
                                variant="ghost"
                                size="menuButton"
                                onClick={close}
                            >
                                <X />
                            </Button>
                        </div>

                        <div className="max-h-screen w-full flex rounded-l-3xl overflow-hidden">
                            <div
                                className={`border-r bg-card relative ${
                                    fullWidth ? "w-[280px]" : "w-[100px]"
                                }`}
                            >
                                <Button size={fullWidth ? "icon" : "iconSm"} 
                                    onClick={() => setFullWidth(!fullWidth)}
                                    className="absolute right-0 top-[50%] translate-y-[-50%] translate-x-1/2">
                                    {fullWidth ? <Minimize2 /> : <Maximize2  className="h-4 w-4"/> }
                                </Button>
                                <div className="flex h-full max-h-screen flex-col ">
                                    <CustomMenu fullWidth={fullWidth} />
                                    <Separator />
                                    <div className="flex flex-col justify-between h-full pb-4">
                                        <nav
                                            className={`${
                                                !fullWidth && "gap-5"
                                            } grid items-start text-sm font-medium px-4 pt-3`}
                                        >
                                            <Link
                                                href="/"
                                                className={`${
                                                    !fullWidth &&
                                                    "justify-center"
                                                } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                                            >
                                                <TooltipProvider delayDuration={50}>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Home className={`h-${fullWidth ? 4 : 5} w-${fullWidth ? 4 : 5}`} />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Homepage</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {fullWidth && "Homepage"}
                                            </Link>
                                            <Link
                                                href="/page1"
                                                className={`${
                                                    !fullWidth &&
                                                    "justify-center"
                                                } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                                            >
                                                <TooltipProvider delayDuration={50}>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <ShoppingCart className={`h-${fullWidth ? 4 : 5} w-${fullWidth ? 4 : 5}`} />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Page 1</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {fullWidth && "Page 1"}
                                            </Link>
                                            <Link
                                                href="/page2"
                                                className={`${
                                                    !fullWidth &&
                                                    "justify-center"
                                                } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                                            >
                                                <TooltipProvider delayDuration={50}>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Package className={`h-${fullWidth ? 4 : 5} w-${fullWidth ? 4 : 5}`} />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Page 2</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {fullWidth && "Page 2"}
                                            </Link>
                                            <Link
                                                href="/page3"
                                                className={`${
                                                    !fullWidth &&
                                                    "justify-center"
                                                } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                                            >
                                                <TooltipProvider delayDuration={50}>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Users className={`h-${fullWidth ? 4 : 5} w-${fullWidth ? 4 : 5}`} />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Page 3</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {fullWidth && "Page 3"}
                                            </Link>
                                        </nav>
                                        <div className={`flex ${fullWidth ? "justify-between" : "justify-center"} items-center px-4`}>
                                            {fullWidth && (
                                                <p className="text-xs text-muted-foreground text-nowrap">
                                                    <span className="text-primary">
                                                        Software Name
                                                    </span>{" "}
                                                    - by Onivoid
                                                </p>
                                            )}
                                            <Dialog>
                                                <DialogTrigger className="flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary">
                                                    <Settings className={`h-${fullWidth ? 4 : 5} w-${fullWidth ? 4 : 5}`} />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Settings
                                                        </DialogTitle>
                                                        <DialogDescription
                                                            asChild
                                                        >
                                                            <div>
                                                                <ul>
                                                                    <li className="flex items-center gap-5 text-foreground">
                                                                        DarkMode
                                                                        :{" "}
                                                                        <DarkModeSelector />
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    {/* <div className="mt-auto p-4">
                        <Card x-chunk="dashboard-02-chunk-0">
                            <CardHeader className="p-2 pt-0 md:p-4">
                                <CardTitle>Upgrade to Pro</CardTitle>
                                <CardDescription>
                                    Unlock all features and get unlimited access
                                    to our support team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                <Button size="sm" className="w-full">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div> */}
                                </div>
                            </div>
                            <main className="flex flex-col rounded-r-3xl overflow-hidden w-full">
                                {children}
                            </main>
                        </div>
                    </Suspense>
                </ThemeProvider>
            </body>
        </html>
    );
}
