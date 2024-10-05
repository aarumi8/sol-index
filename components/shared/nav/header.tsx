import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavLinks from "./nav-links";
import { ModeToggle } from "./mode-toggle";
import { WalletConnection } from "../solana/wallet-connection";

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return (
        <header className={cn(className, 'flex h-16 items-center px-4 py-2 border-b border-input mb-4')}>
            <div className="container mx-auto flex justify-between items-center">
                <Link href='/' className="inline-block">
                    <h1 className="text-3xl font-bold">Solana Index</h1>
                </Link>
                <div className="flex items-center gap-2">
                    <WalletConnection />
                    <nav className="hidden md:flex gap-2">
                        <NavLinks />
                    </nav>
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="outline" size="icon">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="w-full">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="py-4">
                                <NavLinks />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}