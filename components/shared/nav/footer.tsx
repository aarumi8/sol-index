import React from "react";
import { cn } from "@/lib/utils";
import { Title } from "../base/title";

interface Props {
    className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
    return (
        <footer className={cn(className, 'flex h-16 items-center px-4 py-2 border-t border-input mb-4')}>
            <div className="container mx-auto flex gap-2 items-center justify-end">
                <a href="https://x.com/" target="_blank" className="inline-block">
                    <Title text="X (Twitter)" size="xss" className="underline" />
                </a>
                <a href="https://x.com/" target="_blank" className="inline-block">
                    <Title text="Github" size="xss" className="underline" />
                </a>
            </div>
        </footer>
    );
}