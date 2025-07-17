'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { 
  Play, 
  Pause, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'

interface WorkflowRun {
  id: string
  workflow_id: string
  workflow_name?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  completed_at?: string
  duration_seconds?: number
  triggered_by: string
  progress?: number
  current_step?: string
  total_steps?: number
  error?: string
}

export function WorkflowQueue() {
  const { toast } = useToast()
  
  const { data: workflows, isLoading, refetch } = useQuery<WorkflowRun[]>({
    queryKey: ['workflow-runs'],
    queryFn: async () => {
      // Simulated data - replace with actual API call
      return [
        {
          id: '1',
          workflow_id: 'wf-001',
          workflow_name: 'Daily Report Generation',
          status: 'running',
          started_at: new Date(Date.now() - 300000).toISOString(),
          triggered_by: 'schedule',
          progress: 65,
          current_step: 'Generating summary',
          total_steps: 5
        },
        {
          id: '2',
          workflow_id: 'wf-002',
          workflow_name: 'Customer Onboarding',
          status: 'pending',
          started_at: new Date(Date.now() - 60000).toISOString(),
          triggered_by: 'user:123',
          progress: 0,
          total_steps: 8
        },
        {
          id: '3',
          workflow_id: 'wf-003',
          workflow_name: 'Data Sync',
          status: 'completed',
          started_at: new Date(Date.now() - 900000).toISOString(),
          completed_at: new Date(Date.now() - 600000).toISOString(),
          duration_seconds: 300,
          triggered_by: 'webhook',
          progress: 100
        },
        {
          id: '4',
          workflow_id: 'wf-004',
          workflow_name: 'Error Notification',
          status: 'failed',
          started_at: new Date(Date.now() - 1800000).toISOString(),
          completed_at: new Date(Date.now() - 1500000).toISOString(),
          duration_seconds: 300,
          triggered_by: 'system',
          error: 'Failed to connect to notification service'
        }
      ]
    },
    refetchInterval: 5000,
  })

  const cancelWorkflowMutation = useMutation({
    mutationFn: async (runId: string) => {
      return axios.post(`/api/workflows/runs/${runId}/cancel`)
    },
    onSuccess: () => {
      toast({
        title: 'Workflow Cancelled',
        description: 'The workflow has been cancelled successfully.',
      })
      refetch()
    },
    onError: () => {
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel the workflow.',
        variant: 'destructive',
      })
    },
  })

  const getStatusIcon = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: WorkflowRun['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'running':
        return 'default'
      case 'completed':
        return 'default'  // Changed from 'success' which doesn't exist
      case 'failed':
        return 'destructive'
      case 'cancelled':
        return 'outline'
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const activeWorkflows = workflows?.filter(w => ['running', 'pending'].includes(w.status)) || []
  const completedWorkflows = workflows?.filter(w => ['completed', 'failed', 'cancelled'].includes(w.status)) || []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Workflow Queue</CardTitle>
            <CardDescription>Monitor and manage running workflows</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeWorkflows.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({completedWorkflows.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {activeWorkflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mb-2" />
                  <p>No active workflows</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeWorkflows.map(workflow => (
                    <Card key={workflow.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusColor(workflow.status)}>
                                {getStatusIcon(workflow.status)}
                                <span className="ml-1 capitalize">{workflow.status}</span>
                              </Badge>
                              <h4 className="font-medium">{workflow.workflow_name}</h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              {workflow.status === 'running' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => cancelWorkflowMutation.mutate(workflow.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {workflow.status === 'running' && workflow.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {workflow.current_step || 'Processing...'}
                                </span>
                                <span className="text-muted-foreground">
                                  {workflow.progress}%
                                </span>
                              </div>
                              <Progress value={workflow.progress} className="h-2" />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Started {formatTimeAgo(workflow.started_at)}</span>
                            <span>Triggered by {workflow.triggered_by}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {completedWorkflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Clock className="h-12 w-12 mb-2" />
                  <p>No workflow history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedWorkflows.map(workflow => (
                    <Card key={workflow.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusColor(workflow.status)}>
                                {getStatusIcon(workflow.status)}
                                <span className="ml-1 capitalize">{workflow.status}</span>
                              </Badge>
                              <h4 className="font-medium">{workflow.workflow_name}</h4>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDuration(workflow.duration_seconds)}
                            </span>
                          </div>
                          
                          {workflow.error && (
                            <div className="p-2 bg-destructive/10 rounded text-sm text-destructive">
                              {workflow.error}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Completed {formatTimeAgo(workflow.completed_at!)}</span>
                            <span>Triggered by {workflow.triggered_by}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}