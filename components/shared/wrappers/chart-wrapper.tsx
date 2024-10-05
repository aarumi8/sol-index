import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import PriceChart from "@/components/shared/charts/price-chart";
import { Title } from "@/components/shared/base/title";
import Container from "@/components/shared/base/container";

interface ChartWrapperProps {
  isLoading: boolean;
  chartData: { date: string; price: number }[];
  title: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ isLoading, chartData, title }) => {
  if (isLoading) {
    return (
      <Container>
        <Skeleton className="w-full h-8 mb-4" />
        <Skeleton className="w-full h-[300px]" />
      </Container>
    );
  }

  return (
    <Container>
      <Title text={title} className="font-extrabold mb-4" />
      <PriceChart data={chartData} />
    </Container>
  );
};

export default ChartWrapper;