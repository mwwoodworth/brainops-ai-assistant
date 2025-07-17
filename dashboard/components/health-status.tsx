'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { SystemStatus } from '@/hooks/use-system-status'

interface HealthStatusProps {
  status: SystemStatus | undefined
  isLoading: boolean
}

export function HealthStatus({ status, isLoading }: HealthStatusProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Loading system status...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Unable to fetch system status</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>
    )
  }

  const services = Object.entries(status.services || {})
  const healthyCount = services.filter(([_, isHealthy]) => isHealthy).length
  const healthPercentage = (healthyCount / services.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          System Health
          <Badge variant={healthPercentage === 100 ? 'default' : healthPercentage >= 50 ? 'secondary' : 'destructive'}>
            {healthPercentage === 100 ? 'All Systems Operational' : `${healthyCount}/${services.length} Services`}
          </Badge>
        </CardTitle>
        <CardDescription>Real-time service monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Health</span>
              <span className="text-sm text-muted-foreground">{Math.round(healthPercentage)}%</span>
            </div>
            <Progress value={healthPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            {services.map(([service, isHealthy]) => (
              <div key={service} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium capitalize">{service} Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  {isHealthy ? (
                    <>
                      <span className="text-xs text-green-600">Operational</span>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-destructive">Offline</span>
                      <XCircle className="h-4 w-4 text-destructive" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Version: {status.version}</span>
              <span>Uptime: {status.uptime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}