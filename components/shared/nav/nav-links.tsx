'use client';

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
    className?: string
}

const NavLinks: React.FC<Props> = ({ className }) => {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col w-full gap-2", className)}>
            {pathname !== "/" && (
                <Link href="/" className="w-full">
                    <Button className="w-full">Explore</Button>
                </Link>
            )}
            {pathname !== "/create" && (
                <Link href="/create" className="w-full">
                    <Button className="w-full">Create Index</Button>
                </Link>
            )}
        </div>
    );
}

export default NavLinks;