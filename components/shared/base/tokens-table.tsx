'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from 'lucide-react';

interface TableData {
  token: string;
  price: number;
  mcap: string;
  percentage: number;
  address: string;
}

interface TokensTableProps {
  data: TableData[];
}

type SortKey = 'price' | 'mcap' | 'percentage';

const TokensTable: React.FC<TokensTableProps> = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [sortKey, setSortKey] = useState<SortKey>('percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    handleSort('percentage');
  }, []);

  const handleRowClick = (item: TableData) => {
    window.open(`https://dexscreener.com/solana/${item.address}`, '_blank');
  };

  const handleSort = (key: SortKey) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortKey(key);
    setSortOrder(isAsc ? 'desc' : 'asc');

    const sortedData = [...data].sort((a, b) => {
      if (key === 'price' || key === 'percentage') {
        return isAsc ? a[key] - b[key] : b[key] - a[key];
      } else {
        const aValue = parseFloat(a.mcap.replace(/[$TB]/g, ''));
        const bValue = parseFloat(b.mcap.replace(/[$TB]/g, ''));
        return isAsc ? aValue - bValue : bValue - aValue;
      }
    });

    setData(sortedData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-bold text-sm text-accent-foreground px-4">
        <div>Token</div>
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
        <div className="hidden md:flex items-center cursor-pointer" onClick={() => handleSort('mcap')}>
          Market Cap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
        <div className="hidden md:flex items-center cursor-pointer" onClick={() => handleSort('percentage')}>
          Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
        <div className="hidden md:block"></div>
      </div>
      {data.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-background rounded-lg shadow-md p-4 grid grid-cols-2 md:grid-cols-5 gap-4 items-center cursor-pointer border border-input hover:shadow-lg hover:scale-[1.02] transition-all"
          onClick={() => handleRowClick(item)}
        >
          <div>{item.token}</div>
          <div>${item.price.toLocaleString()}</div>
          <div className="hidden md:block">{item.mcap}</div>
          <div className="hidden md:block">{item.percentage.toFixed(2)}%</div>
          <div className="hidden md:flex justify-end">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://dexscreener.com/solana/${item.address}`, '_blank');
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

export default TokensTable;