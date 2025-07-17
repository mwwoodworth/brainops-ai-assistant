import { render, screen } from '@testing-library/react'
import { HealthStatus } from '@/components/health-status'

describe('HealthStatus', () => {
  const mockStatus = {
    status: 'online',
    timestamp: '2024-01-01T00:00:00Z',
    services: {
      assistant: true,
      voice: true,
      workflow: false,
      qa: true,
      files: true,
    },
    version: '1.0.0',
    uptime: '12:34:56',
  }

  it('renders loading state', () => {
    render(<HealthStatus status={undefined} isLoading={true} />)
    expect(screen.getByText('Loading system status...')).toBeInTheDocument()
  })

  it('renders error state when no status', () => {
    render(<HealthStatus status={undefined} isLoading={false} />)
    expect(screen.getByText('Unable to fetch system status')).toBeInTheDocument()
  })

  it('renders system health correctly', () => {
    render(<HealthStatus status={mockStatus} isLoading={false} />)
    
    // Check title
    expect(screen.getByText('System Health')).toBeInTheDocument()
    
    // Check services
    expect(screen.getByText('Assistant Service')).toBeInTheDocument()
    expect(screen.getByText('Voice Service')).toBeInTheDocument()
    expect(screen.getByText('Workflow Service')).toBeInTheDocument()
    
    // Check operational status
    const operationalElements = screen.getAllByText('Operational')
    expect(operationalElements).toHaveLength(4) // 4 out of 5 services are operational
    
    // Check offline status
    expect(screen.getByText('Offline')).toBeInTheDocument()
    
    // Check version and uptime
    expect(screen.getByText('Version: 1.0.0')).toBeInTheDocument()
    expect(screen.getByText('Uptime: 12:34:56')).toBeInTheDocument()
  })

  it('calculates health percentage correctly', () => {
    render(<HealthStatus status={mockStatus} isLoading={false} />)
    
    // 4 out of 5 services are healthy = 80%
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('4/5 Services')).toBeInTheDocument()
  })

  it('displays all systems operational when all services are healthy', () => {
    const allHealthyStatus = {
      ...mockStatus,
      services: {
        assistant: true,
        voice: true,
        workflow: true,
        qa: true,
        files: true,
      },
    }
    
    render(<HealthStatus status={allHealthyStatus} isLoading={false} />)
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})