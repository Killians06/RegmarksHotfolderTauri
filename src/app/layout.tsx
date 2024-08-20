"use client";

import "./globals.css";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/custom/Sidebar";
import { ControlMenu } from "@/components/custom/ControlMenu";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/custom/ThemeProvider";

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
        <html lang="en" suppressHydrationWarning className="static min-w-full">
            <head />
            <body
                className={cn(
                    "min-h-screen font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <Suspense fallback={<p>Loading ... </p>}>
                        <ControlMenu />

                        <div className="max-h-screen w-full flex rounded-l-3xl overflow-hidden">
                            <Sidebar />
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
