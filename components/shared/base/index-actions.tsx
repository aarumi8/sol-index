import React from "react";
import Container from "./container";
import { Title } from "./title";
import IndexAction from "./index-action";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    className?: string;
    isLoading?: boolean;
}

const IndexActions: React.FC<Props> = ({ className, isLoading }) => {
    if (isLoading) {
        return (
            <Container className="gap-4">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <div className="flex flex-col h-full gap-8">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-4 w-full mt-4" />
            </Container>
        );
    }

    return (
        <Container className="gap-4">
            <Title text="Actions" className="font-extrabold" />

            <div className="flex flex-col h-full gap-8">
                <IndexAction title="Buy the index which contains all the tokens of it" titleBtn="Buy" />
                <IndexAction title="Sell the index and receive all its value in SOL" titleBtn="Sell" />
                <IndexAction title="Redeem the index and receive all the tokens of it" titleBtn="Redeem" />
            </div>

            <Title text="All actions take 1% fee to the protocol and the index creator" size="xss" className="text-gray-600" />
        </Container>
    )
}

export default IndexActions;