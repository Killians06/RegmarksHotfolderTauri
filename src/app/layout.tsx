import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { CustomMenu } from "@/components/custom/CustomMenu";
import { LateralBar } from "@/components/custom/LateralBar";
import { DraggableRegion } from "@/components/custom/DraggableRegion";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { Suspense } from 'react';

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
    return (
        <html lang="en" suppressHydrationWarning className="rounded-3xl overflow-hidden">
            <head />
            <body className={cn("min-h-screen font-sans antialiased bg-transparent", fontSans.variable)}>
                    <DraggableRegion>
                        <ThemeProvider attribute="class" defaultTheme="dark">
                        <Suspense fallback={<p>Loading ... </p>}>
                            <main>
                                <div>
                                    <LateralBar />
                                </div>
                                <div className="bg-background relative rounded-3xl">
                                    <CustomMenu />
                                    {children}
                                </div>
                            </main>
                        </Suspense>
                        </ThemeProvider>
                    </DraggableRegion>
            </body>
        </html>
    );
}