import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { Suspense } from "react";

import Link from "next/link";

import {
    CircleUser,
    Home,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { DarkModeSelector } from "@/components/custom/DarkModeSelector";

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

import { CustomMenu } from "@/components/custom/CustomMenu";

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
        <html lang="en" suppressHydrationWarning>
            <head />
            <body
                className={cn(
                    "min-h-screen font-sans antialiased rounded-3xl overflow-hidden",
                    fontSans.variable,
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <Suspense fallback={<p>Loading ... </p>}>
                        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                            <div className="hidden border-r bg-card md:block rounded-l-3xl">
                                <div className="flex h-full max-h-screen flex-col">
                                    <CustomMenu />
                                    <div className="flex py-3 items-center gap-2 justify-between border-b px-4">
                                        <Link
                                            href="/"
                                            className="flex items-center ont-semibold"
                                        >
                                            <span className="">
                                                Software Name
                                            </span>
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-full"
                                                    size="menuButton"
                                                >
                                                    <CircleUser />
                                                    <span className="sr-only">
                                                        Toggle user menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    My Account
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    Support
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    Logout
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex-1">
                                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                            <Link
                                                href="/"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                            >
                                                <Home className="h-4 w-4" />
                                                Homepage
                                            </Link>
                                            <Link
                                                href="/page1"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                Page 1
                                            </Link>
                                            <Link
                                                href="/page2"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                            >
                                                <Package className="h-4 w-4" />
                                                Page 2
                                            </Link>
                                            <Link
                                                href="/page3"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                            >
                                                <Users className="h-4 w-4" />
                                                Page 3
                                            </Link>
                                            <Dialog>
                                                <DialogTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                                    <Settings className="h-4 w-4" />
                                                    Settings
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
                                        </nav>
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
                            <div className="flex flex-col">
                                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 rounded-r-3xl">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </Suspense>
                </ThemeProvider>
            </body>
        </html>
    );
}
