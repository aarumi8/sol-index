'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface Token {
  id: string;
  address: string;
  name: string;
  ticker: string;
  imageURL: string | null;
  percentage: number;
}

interface Index {
  id: string;
  address: string;
  name: string;
  ticker: string;
  price: number;
  topTokens: Token[];
}

interface IndexTableProps {
  data: Index[];
  isLoading: boolean;
  error: string | null;
}

type SortKey = 'price' | 'mcap';

const IndexTable: React.FC<IndexTableProps> = ({ data: initialData, isLoading, error }) => {
  const [data, setData] = useState(initialData);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleRowClick = (item: Index) => {
    router.push(`/index/${item.address}`);
  };

  const handleSort = (key: SortKey) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortKey(key);
    setSortOrder(isAsc ? 'desc' : 'asc');

    const sortedData = [...data].sort((a, b) => {
      if (key === 'price') {
        return isAsc ? b.price - a.price : a.price - b.price;
      } else {
        return 0;
      }
    });

    setData(sortedData);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-background rounded-lg shadow-md p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center border border-input">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="hidden md:block h-4 w-[120px]" />
            <div className="hidden md:flex justify-end">
              <Skeleton className="h-10 w-[60px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-bold text-sm text-accent-foreground px-4">
        <div>Index</div>
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
        <div className="hidden md:block">Top Tokens</div>
        <div className="hidden md:block"></div>
      </div>
      {data.map((item) => (
        <div 
          key={item.id} 
          className="bg-background rounded-lg shadow-md p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center cursor-pointer border border-input hover:shadow-lg hover:scale-[1.02] transition-all"
          onClick={() => handleRowClick(item)}
        >
          <div>{item.name} ({item.ticker})</div>
          <div>${item.price.toLocaleString()}</div>
          <div className="hidden md:block">
            {item.topTokens.map(token => token.ticker).join(', ')}
          </div>
          <div className="hidden md:flex justify-end">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/index/${item.address}`);
              }}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndexTable;