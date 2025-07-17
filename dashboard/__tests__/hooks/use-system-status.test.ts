import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSystemStatus } from '@/hooks/use-system-status'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useSystemStatus', () => {
  const mockSystemStatus = {
    status: 'online',
    timestamp: '2024-01-01T00:00:00Z',
    services: {
      assistant: true,
      voice: true,
      workflow: true,
      qa: true,
      files: true,
    },
    version: '1.0.0',
    uptime: '12:34:56',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches system status successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSystemStatus })

    const { result } = renderHook(() => useSystemStatus(), {
      wrapper: createWrapper(),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.systemStatus).toBeUndefined()

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.systemStatus).toEqual(mockSystemStatus)
    expect(result.current.error).toBeNull()
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/status')
  })

  it('handles error when fetching system status fails', async () => {
    const mockError = new Error('Network error')
    mockedAxios.get.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSystemStatus(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.systemStatus).toBeUndefined()
    expect(result.current.error).toBeTruthy()
  })

  it('provides refetch function', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSystemStatus })

    const { result } = renderHook(() => useSystemStatus(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.refetch).toBe('function')
    
    // Call refetch
    mockedAxios.get.mockResolvedValueOnce({ data: { ...mockSystemStatus, uptime: '13:00:00' } })
    result.current.refetch()

    await waitFor(() => {
      expect(result.current.systemStatus?.uptime).toBe('13:00:00')
    })
  })
})