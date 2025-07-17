import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WorkflowQueue } from '@/components/workflow-queue'
import { useToast } from '@/components/ui/use-toast'

// Mock the useToast hook
jest.mock('@/components/ui/use-toast')

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('WorkflowQueue', () => {
  const mockToast = jest.fn()

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders workflow queue with tabs', async () => {
    render(
      <Wrapper>
        <WorkflowQueue />
      </Wrapper>
    )

    expect(screen.getByText('Workflow Queue')).toBeInTheDocument()
    expect(screen.getByText('Monitor and manage running workflows')).toBeInTheDocument()
    
    // Check tabs
    expect(screen.getByRole('tab', { name: /Active/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /History/i })).toBeInTheDocument()
  })

  it('displays active workflows correctly', async () => {
    render(
      <Wrapper>
        <WorkflowQueue />
      </Wrapper>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Daily Report Generation')).toBeInTheDocument()
      expect(screen.getByText('Customer Onboarding')).toBeInTheDocument()
    })

    // Check workflow statuses
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    
    // Check progress bar for running workflow
    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('Generating summary')).toBeInTheDocument()
  })

  it('switches between active and history tabs', async () => {
    render(
      <Wrapper>
        <WorkflowQueue />
      </Wrapper>
    )

    // Click on History tab
    const historyTab = screen.getByRole('tab', { name: /History/i })
    fireEvent.click(historyTab)

    await waitFor(() => {
      expect(screen.getByText('Data Sync')).toBeInTheDocument()
      expect(screen.getByText('Error Notification')).toBeInTheDocument()
    })

    // Check completed workflow details
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText('5m 0s')).toBeInTheDocument()
  })

  it('displays error details for failed workflows', async () => {
    render(
      <Wrapper>
        <WorkflowQueue />
      </Wrapper>
    )

    // Switch to history tab
    const historyTab = screen.getByRole('tab', { name: /History/i })
    fireEvent.click(historyTab)

    await waitFor(() => {
      expect(screen.getByText('Failed to connect to notification service')).toBeInTheDocument()
    })
  })

  it('refreshes workflow data when refresh button is clicked', async () => {
    render(
      <Wrapper>
        <WorkflowQueue />
      </Wrapper>
    )

    const refreshButton = screen.getByRole('button', { name: /Refresh/i })
    fireEvent.click(refreshButton)

    // Button should show loading state
    expect(refreshButton).toBeDisabled()
  })

  it('formats time ago correctly', async () => {
    render(
      <Wrapper>
        <WorkflowQueue />
      </Wrapper>
    )

    await waitFor(() => {
      // Check that time formatting is present
      expect(screen.getByText(/Started.*ago/)).toBeInTheDocument()
    })
  })
})