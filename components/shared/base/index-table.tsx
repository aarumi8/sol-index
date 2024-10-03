'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

interface TableData {
  index: string;
  price: number;
  mcap: string;
}

interface IndexTableProps {
  data: TableData[];
}

type SortKey = 'price' | 'mcap';

const IndexTable: React.FC<IndexTableProps> = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  const handleRowClick = (item: TableData) => {
    router.push(`/item/${item.index}`);
  };

  const handleSort = (key: SortKey) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortKey(key);
    setSortOrder(isAsc ? 'desc' : 'asc');

    const sortedData = [...data].sort((a, b) => {
      if (key === 'price') {
        return isAsc ? b.price - a.price : a.price - b.price;
      } else {
        // For 'mcap', remove the '$' and 'T'/'B' to convert to number
        const aValue = parseFloat(a.mcap.replace(/[$TB]/g, ''));
        const bValue = parseFloat(b.mcap.replace(/[$TB]/g, ''));
        return isAsc ? bValue - aValue : aValue - bValue;
      }
    });

    setData(sortedData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-bold text-sm text-gray-600 px-4">
        <div>Index</div>
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
        <div className="hidden md:flex items-center cursor-pointer" onClick={() => handleSort('mcap')}>
          Market Cap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
        <div className="hidden md:block"></div>
      </div>
      {data.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-lg shadow-md p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center cursor-pointer border-2 border-gray-100 hover:shadow-lg"
          onClick={() => handleRowClick(item)}
        >
          <div>{item.index}</div>
          <div>${item.price.toLocaleString()}</div>
          <div className="hidden md:block">{item.mcap}</div>
          <div className="hidden md:flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/item/${item.index}`);
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