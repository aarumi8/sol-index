'use client';

import React from 'react';
import IndexTable from '@/components/shared/base/index-table';
import { useIndexes } from '@/hooks/useIndexes';

const IndexTableWrapper: React.FC = () => {
  const { indexes, isLoading, error } = useIndexes();

  return <IndexTable data={indexes} isLoading={isLoading} error={error} />;
};

export default IndexTableWrapper;