"use client";

import { CircleUser } from "lucide-react";
import { DraggableRegion } from "@/components/custom/DraggableRegion";

export const CustomMenu = ({ fullWidth }: { fullWidth: boolean }) => {
    return (
        <>
            <DraggableRegion>
                <div
                    className={`${
                        fullWidth
                            ? "grid grid-cols-4 px-4 py-6"
                            : "flex justify-center items-center p-5"
                    } text-foreground`}
                >
                    {fullWidth && (
                        <div className="flex items-center justify-center col-span-3 overflow-hidden">
                            <h1 className="font-bold uppercase text-primary text-nowrap">
                                Software Name
                            </h1>
                        </div>
                    )}
                    <div className="col-span-1 flex items-center justify-center">
                        <CircleUser className="h-6 w-6" />
                    </div>
                </div>
            </DraggableRegion>
        </>
    );
};
