"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { hexToHSL } from "@/utils/hexToHsl";

export function PickerExample() {
    const [background, setBackground] = useState("#3B3B98");

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--primary",
            hexToHSL(background),
        );
    }, [background]);

    return (
        <GradientPicker background={background} setBackground={setBackground} />
    );
}

export function GradientPicker({
    background,
    setBackground,
    className,
}: {
    background: string;
    setBackground: (background: string) => void;
    className?: string;
}) {
    const solids = ["#3B3B98", "#B33771", "#FC427B", "#FEA47F"];

    const defaultTab = useMemo(() => {
        return "solid";
    }, []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[220px] justify-start text-left font-normal",
                        !background && "text-muted-foreground",
                        className,
                    )}
                >
                    <div className="w-full flex items-center gap-2">
                        {background ? (
                            <div
                                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                                style={{ background }}
                            ></div>
                        ) : (
                            <Paintbrush className="h-4 w-4" />
                        )}
                        <div className="truncate flex-1">
                            {background ? background : "Pick a color"}
                        </div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsContent
                        value="solid"
                        className="flex flex-wrap gap-1 mt-2"
                    >
                        {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: `hsl(${hexToHSL(s)})` }}
                                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                                onClick={() => setBackground(s)}
                            />
                        ))}
                    </TabsContent>
                </Tabs>

                <Input
                    id="custom"
                    value={background}
                    className="col-span-2 h-8 mt-4"
                    onChange={(e) => setBackground(e.currentTarget.value)}
                />
            </PopoverContent>
        </Popover>
    );
}

const GradientButton = ({
    background,
    children,
}: {
    background: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
            style={{ background }}
        >
            <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
                {children}
            </div>
        </div>
    );
};
