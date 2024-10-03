import React from "react";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn(className, 'flex h-16 items-center justify-between px-4 py-2 border-b-2')}>
            <h1 className="text-3xl font-bold">Solana Index</h1>
        </div>
    );
}