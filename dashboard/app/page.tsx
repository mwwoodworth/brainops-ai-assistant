'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { HealthStatus } from '@/components/health-status'
import { WorkflowQueue } from '@/components/workflow-queue'
import { RecentActivity } from '@/components/recent-activity'
import { SystemLogs } from '@/components/system-logs'
import { TriggerControls } from '@/components/trigger-controls'
import { ServiceGrid } from '@/components/service-grid'
import { MetricsChart } from '@/components/metrics-chart'
import { useSystemStatus } from '@/hooks/use-system-status'
import { useToast } from '@/components/ui/use-toast'
import { Activity, BarChart3, Brain, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const { systemStatus, isLoading, error, refetch } = useSystemStatus()
  const { toast } = useToast()
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetch()
      }, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refetch])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to BrainOps backend. Please check if the service is running.',
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const getSystemHealth = () => {
    if (!systemStatus) return 'unknown'
    const services = Object.values(systemStatus.services || {})
    const healthyCount = services.filter(status => status === true).length
    if (healthyCount === services.length) return 'healthy'
    if (healthyCount > services.length / 2) return 'partial'
    return 'unhealthy'
  }

  const systemHealth = getSystemHealth()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">BrainOps AI Dashboard</h1>
                <p className="text-sm text-muted-foreground">Operational Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={systemHealth === 'healthy' ? 'default' : systemHealth === 'partial' ? 'secondary' : 'destructive'}>
                {systemHealth === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {systemHealth === 'partial' && <AlertCircle className="h-3 w-3 mr-1" />}
                {systemHealth === 'unhealthy' && <AlertCircle className="h-3 w-3 mr-1" />}
                System {systemHealth}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>{autoRefresh ? 'Auto' : 'Manual'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">5 pending, 18 running</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <Progress value={98.5} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245ms</div>
                <p className="text-xs text-muted-foreground">-15ms from baseline</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <HealthStatus status={systemStatus} isLoading={isLoading} />
                <MetricsChart />
              </div>
              <ServiceGrid services={systemStatus?.services || {}} />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <ServiceGrid services={systemStatus?.services || {}} detailed />
            </TabsContent>

            <TabsContent value="workflows" className="space-y-4">
              <WorkflowQueue />
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <RecentActivity />
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <SystemLogs />
            </TabsContent>

            <TabsContent value="controls" className="space-y-4">
              <TriggerControls />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          BrainOps AI Assistant v1.0.0 | {systemStatus?.timestamp ? new Date(systemStatus.timestamp).toLocaleString() : 'Connecting...'}
        </div>
      </footer>
    </div>
  )
}