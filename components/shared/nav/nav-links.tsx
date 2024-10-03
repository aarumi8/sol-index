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
        <div className={cn("flex flex-col md:flex-row w-full md:w-auto gap-2", className)}>
            {pathname !== "/" && (
                <Link href="/" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto">Explore</Button>
                </Link>
            )}
            {pathname !== "/create" && (
                <Link href="/create" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto">Create Index</Button>
                </Link>
            )}
        </div>
    );
}

export default NavLinks;