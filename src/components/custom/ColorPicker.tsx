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
import { useMemo, useEffect } from "react";
import { hexToHSL } from "@/utils/hexToHsl";

import { useThemeStore } from "@/stores/themeStore";

export function PickerExample() {
    const { primaryColor } = useThemeStore();

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--primary",
            hexToHSL(primaryColor),
        );
    }, [primaryColor]);

    return <GradientPicker primaryColor={primaryColor} />;
}

export function GradientPicker({
    primaryColor,
    className,
}: {
    primaryColor: string;
    className?: string;
}) {
    const { setPrimaryColor, primaryColorChoices } = useThemeStore();

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
                        !primaryColor && "text-muted-foreground",
                        className,
                    )}
                >
                    <div className="w-full flex items-center gap-2">
                        {primaryColor ? (
                            <div
                                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                                style={{ background: primaryColor }}
                            ></div>
                        ) : (
                            <Paintbrush className="h-4 w-4" />
                        )}
                        <div className="truncate flex-1">
                            {primaryColor ? primaryColor : "Pick a color"}
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
                        {primaryColorChoices.map((s) => (
                            <div
                                key={s}
                                style={{ background: `hsl(${hexToHSL(s)})` }}
                                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                                onClick={() => setPrimaryColor(s)}
                            />
                        ))}
                    </TabsContent>
                </Tabs>

                <Input
                    id="custom"
                    value={primaryColor}
                    className="col-span-2 h-8 mt-4"
                    onChange={(e) => setPrimaryColor(e.currentTarget.value)}
                />
            </PopoverContent>
        </Popover>
    );
}

const GradientButton = ({
    primaryColor,
    children,
}: {
    primaryColor: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
            style={{ background: primaryColor }}
        >
            <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
                {children}
            </div>
        </div>
    );
};
