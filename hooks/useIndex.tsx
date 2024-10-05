'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Token {
  token: string;
  price: number;
  mcap: string;
  percentage: number;
}

interface ChartData {
  date: string;
  price: number;
}

interface IndexData {
  id: string;
  address: string;
  name: string;
  ticker: string;
  price: number;
  tokens: Token[];
  chartData: ChartData[];
}

export function useIndex(address: string) {
  const [indexData, setIndexData] = useState<IndexData | null>(null);
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
  }, [address]);

  return { indexData, isLoading, error };
}