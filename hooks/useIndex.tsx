'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { IndexData, Token, ChartData } from '@/types';
import { useIndexStore } from '@/store/useIndexStore';

export function useIndex(address: string) {
  const { indexData, setIndexData } = useIndexStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndexData = async () => {
      try {
        const response = await axios.get<IndexData>(`/api/index?address=${address}`);
        setIndexData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch index data');
        setIsLoading(false);
      }
    };

    fetchIndexData();
  }, [address, setIndexData]);

  return { indexData, isLoading, error };
}