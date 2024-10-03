import React from "react";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return (
        <header className={cn(className, 'flex h-16 items-center justify-between px-4 py-2 border-b-2 mb-4')}>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold">Solana Index</h1>
            </div>
        </header>
    );
}