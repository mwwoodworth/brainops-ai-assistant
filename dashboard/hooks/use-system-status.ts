'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface SystemStatus {
  status: string
  timestamp: string
  services: {
    assistant: boolean
    voice: boolean
    workflow: boolean
    qa: boolean
    files: boolean
  }
  version: string
  uptime: string
}

export function useSystemStatus() {
  const { data, isLoading, error, refetch } = useQuery<SystemStatus>({
    queryKey: ['system-status'],
    queryFn: async () => {
      const response = await axios.get('/api/status')
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  return {
    systemStatus: data,
    isLoading,
    error,
    refetch,
  }
}