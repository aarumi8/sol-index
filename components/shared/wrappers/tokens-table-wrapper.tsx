'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import TokensTable from "@/components/shared/base/tokens-table";
import { Title } from "@/components/shared/base/title";
import Container from "@/components/shared/base/container";

interface TokensTableWrapperProps {
  isLoading: boolean;
  tokens: { token: string; price: number; mcap: string; percentage: number }[];
}

const TokensTableWrapper: React.FC<TokensTableWrapperProps> = ({ isLoading, tokens }) => {
  if (isLoading) {
    return (
      <Container className='w-full'>
        <Skeleton className="w-full h-8 mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container className='w-full'>
      <Title text="Tokens in this index" className="font-extrabold mb-4" />
      <TokensTable data={tokens} />
    </Container>
  );
};

export default TokensTableWrapper;