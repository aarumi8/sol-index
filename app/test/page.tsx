'use client';

import React from 'react';
import CreateTokenButton from '@/components/shared/base/test';

const CreateTokenPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Create Token</h1>
      <CreateTokenButton />
    </div>
  );
};

export default CreateTokenPage;