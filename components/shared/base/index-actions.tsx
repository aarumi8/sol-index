import React from "react";
import { cn } from "@/lib/utils";
import Container from "./container";
import { Title } from "./title";
import IndexAction from "./index-action";

interface Props {
    className?: string;
}

const IndexActions: React.FC<Props> = ({ className }) => {
    return (
        <Container className="gap-4">
            <Title text="Actions" className="font-extrabold" />

            <div className="flex flex-col h-full gap-8">
                <IndexAction title="Buy the index which contains all the tokens of it" titleBtn="Buy" />
                <IndexAction title="Sell the index and receive all its value in SOL" titleBtn="Sell" />
                <IndexAction title="Redeem the index and receive all the tokens of it" titleBtn="Redeem" />
            </div>

            <Title text="All actions take 1% fee to the protocol and the index creator" size="xss" />
        </Container>
    )
}

export default IndexActions;