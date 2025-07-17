'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Mic, 
  Workflow, 
  FileQuestion, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Activity,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'

interface ServiceGridProps {
  services: Record<string, boolean>
  detailed?: boolean
}

const serviceIcons: Record<string, any> = {
  assistant: Brain,
  voice: Mic,
  workflow: Workflow,
  qa: FileQuestion,
  files: FileText,
}

const serviceDescriptions: Record<string, string> = {
  assistant: 'AI-powered chat and command processing',
  voice: 'Voice recognition and synthesis interface',
  workflow: 'Automated task and workflow execution',
  qa: 'Question answering and knowledge retrieval',
  files: 'File operations and document management',
}

export function ServiceGrid({ services, detailed = false }: ServiceGridProps) {
  const { toast } = useToast()
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})

  const handleServiceRestart = async (service: string) => {
    setRefreshing(prev => ({ ...prev, [service]: true }))
    
    try {
      // In a real implementation, this would call an API endpoint to restart the service
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
      
      toast({
        title: 'Service Restarted',
        description: `${service} service has been restarted successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Restart Failed',
        description: `Failed to restart ${service} service.`,
        variant: 'destructive',
      })
    } finally {
      setRefreshing(prev => ({ ...prev, [service]: false }))
    }
  }

  const handleHealthCheck = async (service: string) => {
    try {
      const response = await axios.get(`/api/${service}/health`)
      toast({
        title: 'Health Check',
        description: `${service} service is ${response.data.status}.`,
      })
    } catch (error) {
      toast({
        title: 'Health Check Failed',
        description: `Could not reach ${service} service.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(services).map(([service, isHealthy]) => {
        const Icon = serviceIcons[service] || Activity
        const isRefreshing = refreshing[service] || false

        return (
          <Card key={service} className={`${!isHealthy ? 'border-destructive' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span className="capitalize">{service}</span>
                </div>
                <Badge variant={isHealthy ? 'default' : 'destructive'}>
                  {isHealthy ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {isHealthy ? 'Online' : 'Offline'}
                </Badge>
              </CardTitle>
              <CardDescription>{serviceDescriptions[service]}</CardDescription>
            </CardHeader>
            {detailed && (
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{isHealthy ? 'Running' : 'Stopped'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">{isHealthy ? '12ms' : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Memory</span>
                      <span className="font-medium">{isHealthy ? '256MB' : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">CPU</span>
                      <span className="font-medium">{isHealthy ? '2.3%' : 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isHealthy ? 'outline' : 'default'}
                      onClick={() => handleServiceRestart(service)}
                      disabled={isRefreshing}
                      className="flex-1"
                    >
                      {isRefreshing ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Restarting
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Restart
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleHealthCheck(service)}
                      className="flex-1"
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      Check
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}