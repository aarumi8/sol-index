'use client';

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Token {
  id: string
  address: string
  name: string
  ticker: string
  imageURL: string | null
  percentage: number
}

interface Index {
  id: string
  address: string
  name: string
  ticker: string
  price: number
  topTokens: Token[]
}

export function useIndexes() {
  const [indexes, setIndexes] = useState<Index[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const response = await axios.get<Index[]>('/api/indexes')
        setIndexes(response.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch indexes')
        setIsLoading(false)
      }
    }

    fetchIndexes()
  }, [])

  return { indexes, isLoading, error }
}