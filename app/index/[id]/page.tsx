'use client';

import React from "react";
import IndexActions from "@/components/shared/base/index-actions";
import { cn } from "@/lib/utils";
import { useParams } from 'next/navigation';
import { useIndex } from '@/hooks/useIndex';
import ChartWrapper from "@/components/shared/wrappers/chart-wrapper";
import TokensTableWrapper from "@/components/shared/wrappers/tokens-table-wrapper";

const IndexPage: React.FC = () => {
    const params = useParams();
    const address = params.id as string;
    const { indexData, isLoading, error } = useIndex(address);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={cn("")}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="basis-2/3">
                    <ChartWrapper 
                        isLoading={isLoading} 
                        chartData={indexData?.chartData || []} 
                        title={indexData ? `${indexData.name} (${indexData.ticker})` : ''}
                    />
                </div>
                <div className={cn("basis-1/3")}>
                    <IndexActions isLoading={isLoading} />
                </div>
            </div>

            <div className="flex w-full mt-4">
                <TokensTableWrapper 
                    isLoading={isLoading}
                    tokens={indexData?.tokens || []}
                />
            </div>
        </div>
    );
}

export default IndexPage;