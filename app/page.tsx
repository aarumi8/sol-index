import React from 'react';
import IndexTable from '@/components/shared/base/index-table';

const data = [
  { index: "BTC", price: 50000, mcap: "$1T" },
  { index: "ETH", price: 3000, mcap: "$500B" },
  { index: "ADA", price: 2, mcap: "$50B" },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <IndexTable data={data} />
    </div>
  );
}