"use client";

import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraggableRegion } from "@/components/custom/DraggableRegion";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export const CustomMenu = ({ fullWidth }: { fullWidth: boolean }) => {
    return (
        <>
            <div
                className={`${
                    fullWidth
                        ? "grid grid-cols-4 px-4 py-6"
                        : "flex justify-center items-center p-5"
                } text-foreground`}
            >
                {fullWidth && (
                    <div className="flex items-center justify-center col-span-3 overflow-hidden">
                        <DraggableRegion>
                            <h1 className="font-bold uppercase text-primary text-nowrap">
                                Sofware Name
                            </h1>
                        </DraggableRegion>
                    </div>
                )}
                <div className="col-span-1 flex items-center justify-center">
                    <Dialog>
                        <DialogTrigger className="flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary">
                            <CircleUser className="h-6 w-6" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Account</DialogTitle>
                                <DialogDescription asChild>
                                    <div>
                                        <ul>
                                            <li className="flex items-center gap-5 text-foreground"></li>
                                        </ul>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
};
