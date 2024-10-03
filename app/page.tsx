import React from 'react';
import IndexTable from '@/components/shared/base/index-table';
import CreateIndex from '@/components/shared/base/create-index';
import Welcome from '@/components/shared/base/welcome';

const data = [
  { index: "BTC", price: 50000, mcap: "$1T" },
  { index: "ETH", price: 3000, mcap: "$500B" },
  { index: "ADA", price: 2, mcap: "$50B" },
];

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <Welcome
            title="Welcome to Index Creator"
            description="Create and manage your custom indices with ease. Our platform provides powerful tools for index creation and management."
          />
        </div>
        <div className="flex-1">
          <CreateIndex
            title="Create New Index"
            description="Start creating your custom index now. Define your criteria and watch your index come to life."
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <IndexTable data={data} />
    </>
  );
}