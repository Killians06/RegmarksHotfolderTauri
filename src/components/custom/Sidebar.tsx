"use client";

import Link from "next/link";
import { useState } from "react";
import { PickerExample } from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomMenu } from "@/components/custom/CustomMenu";
import { DarkModeSelector } from "@/components/custom/DarkModeSelector";

import {
    Home,
    Package,
    Settings,
    ShoppingCart,
    Users,
    Maximize2,
    Minimize2,
} from "lucide-react";

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

export const Sidebar = () => {
    const [fullWidth, setFullWidth] = useState(false);

    return (
        <div
            className={`border-r bg-card relative transition-size duration-150 ${
                fullWidth ? "w-[280px]" : "w-[100px]"
            }`}
        >
            <Button
                size={fullWidth ? "icon" : "iconSm"}
                onClick={() => setFullWidth(!fullWidth)}
                className="absolute right-0 top-[50%] translate-y-[-50%] translate-x-1/2"
            >
                {fullWidth ? <Minimize2 /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <div className="flex h-full max-h-screen flex-col ">
                <CustomMenu fullWidth={fullWidth} />
                <Separator />
                <div className="flex flex-col justify-between h-full pb-4">
                    <nav
                        className={`${
                            !fullWidth && "gap-3"
                        } grid items-start text-sm font-medium px-4 pt-3`}
                    >
                        <Link
                            href="/"
                            className={`${
                                !fullWidth && "justify-center"
                            } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                        >
                            <TooltipProvider delayDuration={10}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Home className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Homepage</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {fullWidth && "Homepage"}
                        </Link>
                        <Link
                            href="/page1"
                            className={`${
                                !fullWidth && "justify-center"
                            } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                        >
                            <TooltipProvider delayDuration={50}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ShoppingCart className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Page 1</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {fullWidth && "Page 1"}
                        </Link>
                        <Link
                            href="/page2"
                            className={`${
                                !fullWidth && "justify-center"
                            } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                        >
                            <TooltipProvider delayDuration={50}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Package className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Page 2</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {fullWidth && "Page 2"}
                        </Link>
                        <Link
                            href="/page3"
                            className={`${
                                !fullWidth && "justify-center"
                            } flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary`}
                        >
                            <TooltipProvider delayDuration={50}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Users className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Page 3</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {fullWidth && "Page 3"}
                        </Link>
                    </nav>
                    <div
                        className={`flex ${
                            fullWidth ? "justify-between" : "justify-center"
                        } items-center px-4`}
                    >
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
                                <TooltipProvider delayDuration={50}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Settings className="h-4 w-4" />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>Settings</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Settings</DialogTitle>
                                    <DialogDescription asChild>
                                        <div>
                                            <ul className="text-foreground flex flex-col gap-4 mt-4">
                                                <li className="flex items-center gap-5 text-foreground">
                                                    <p className="min-w-[100px]">
                                                        DarkMode :{" "}
                                                    </p>
                                                    <DarkModeSelector />
                                                </li>
                                                <li className="flex items-center gap-5 text-foreground">
                                                    <p className="min-w-[100px]">
                                                        Color Picker :{" "}
                                                    </p>
                                                    <PickerExample />
                                                </li>
                                            </ul>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};
