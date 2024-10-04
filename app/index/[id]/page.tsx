import Container from "@/components/shared/base/container";
import IndexActions from "@/components/shared/base/index-actions";
import { Title } from "@/components/shared/base/title";
import TokensTable from "@/components/shared/base/tokens-table";
import PriceChart from "@/components/shared/charts/price-chart";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    className?: string;
}

const IndexPage: React.FC<Props> = ({ className }) => {
    const data = [
        { date: '2023-01-01T00:00:00', price: 100 },
        { date: '2023-01-01T01:00:00', price: 120 },
        { date: '2023-01-01T02:00:00', price: 110 },
        { date: '2023-01-01T03:00:00', price: 130 },
        { date: '2023-01-01T04:00:00', price: 140 },
        { date: '2023-01-01T05:00:00', price: 10 },
        // ... more data points
      ];

    const tokens = [
        { token: "BTC", price: 50000, mcap: "$1T", percentage: 10 },
        { token: "ETH", price: 3000, mcap: "$500B", percentage: 20 },
        { token: "ADA", price: 2, mcap: "$50B", percentage: 70 },
    ]
      
    return (
        <div className={cn(className, "")}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="basis-2/3">
                    <Container>
                        <Title text="Chart" className="font-extrabold mb-4" />
                        <PriceChart data={data} />
                    </Container>
                </div>
                <div className={cn("basis-1/3", className)}>
                    <IndexActions />
                </div>
            </div>

            <div className="flex w-full mt-4">
                <Container className="w-full">
                    <Title text="Tokens in this index" className="font-extrabold mb-4" />
                    <TokensTable data={tokens} />
                </Container>
            </div>
        </div>
    );
}

export default IndexPage;
