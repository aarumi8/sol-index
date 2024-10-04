import React from "react";
import { Button } from "@/components/ui/button";
import { Title } from "./title";

interface Props {
    className?: string;
    title: string,
    titleBtn: string
}

const IndexAction: React.FC<Props> = ({ className, title, titleBtn }) => {
    return (
        <div className="flex flex-col gap-1">
            <Title text={title} size="xs" className="text-gray-600" />
            <Button size="lg">{titleBtn}</Button>
        </div>
    );
}

export default IndexAction;