'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { 
  Play, 
  Settings, 
  Workflow, 
  MessageSquare,
  FileText,
  Webhook,
  Calendar,
  Loader2,
  Plus
} from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  trigger_type: string
  parameters: Record<string, any>
}

export function TriggerControls() {
  const { toast } = useToast()
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')
  const [triggerData, setTriggerData] = useState<Record<string, any>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: workflows } = useQuery<WorkflowTemplate[]>({
    queryKey: ['workflow-templates'],
    queryFn: async () => {
      // Simulated data - replace with actual API call
      return [
        {
          id: 'wf-001',
          name: 'Daily Report Generation',
          description: 'Generate and send daily activity reports',
          trigger_type: 'manual',
          parameters: {
            recipients: [],
            includeMetrics: true,
          }
        },
        {
          id: 'wf-002',
          name: 'Data Backup',
          description: 'Backup system data to cloud storage',
          trigger_type: 'manual',
          parameters: {
            backupType: 'full',
            compression: true,
          }
        },
        {
          id: 'wf-003',
          name: 'System Health Check',
          description: 'Run comprehensive system diagnostics',
          trigger_type: 'manual',
          parameters: {
            depth: 'full',
            includePerformance: true,
          }
        },
        {
          id: 'wf-004',
          name: 'Knowledge Base Sync',
          description: 'Synchronize knowledge base with external sources',
          trigger_type: 'manual',
          parameters: {
            sources: ['docs', 'wiki'],
            fullSync: false,
          }
        },
      ]
    },
  })

  const runWorkflowMutation = useMutation({
    mutationFn: async (data: { workflowId: string; parameters: Record<string, any> }) => {
      return axios.post(`/api/workflows/${data.workflowId}/run`, {
        trigger_data: data.parameters,
        triggered_by: 'manual',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Workflow Started',
        description: 'The workflow has been triggered successfully.',
      })
      setIsDialogOpen(false)
      setSelectedWorkflow('')
      setTriggerData({})
    },
    onError: () => {
      toast({
        title: 'Trigger Failed',
        description: 'Failed to start the workflow. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const handleTriggerWorkflow = () => {
    if (selectedWorkflow) {
      runWorkflowMutation.mutate({
        workflowId: selectedWorkflow,
        parameters: triggerData,
      })
    }
  }

  const quickActions = [
    {
      id: 'restart-services',
      name: 'Restart All Services',
      icon: Settings,
      color: 'bg-blue-500',
      action: async () => {
        toast({
          title: 'Services Restarting',
          description: 'All services are being restarted...',
        })
      }
    },
    {
      id: 'clear-cache',
      name: 'Clear System Cache',
      icon: FileText,
      color: 'bg-green-500',
      action: async () => {
        toast({
          title: 'Cache Cleared',
          description: 'System cache has been cleared successfully.',
        })
      }
    },
    {
      id: 'test-webhook',
      name: 'Test Webhooks',
      icon: Webhook,
      color: 'bg-purple-500',
      action: async () => {
        toast({
          title: 'Webhook Test',
          description: 'Webhook test initiated. Check logs for results.',
        })
      }
    },
    {
      id: 'sync-schedule',
      name: 'Sync Schedules',
      icon: Calendar,
      color: 'bg-orange-500',
      action: async () => {
        toast({
          title: 'Schedule Sync',
          description: 'All scheduled tasks have been synchronized.',
        })
      }
    },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and system controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={action.action}
                >
                  <div className={`h-10 w-10 rounded-full ${action.color} flex items-center justify-center text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{action.name}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manual Workflow Triggers */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Workflow Triggers</CardTitle>
          <CardDescription>Manually start workflows and automation tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflows?.map((workflow) => (
                <Card key={workflow.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{workflow.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {workflow.description}
                          </p>
                        </div>
                        <Workflow className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Dialog open={isDialogOpen && selectedWorkflow === workflow.id} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                          setSelectedWorkflow('')
                          setTriggerData({})
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedWorkflow(workflow.id)
                              setTriggerData(workflow.parameters)
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Run Workflow
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Configure Workflow</DialogTitle>
                            <DialogDescription>
                              Set parameters for {workflow.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {Object.entries(workflow.parameters).map(([key, value]) => (
                              <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                {typeof value === 'boolean' ? (
                                  <Switch
                                    id={key}
                                    checked={triggerData[key] || false}
                                    onCheckedChange={(checked) => 
                                      setTriggerData(prev => ({ ...prev, [key]: checked }))
                                    }
                                  />
                                ) : Array.isArray(value) ? (
                                  <Input
                                    id={key}
                                    placeholder={`Enter ${key} (comma separated)`}
                                    value={triggerData[key]?.join(',') || ''}
                                    onChange={(e) => 
                                      setTriggerData(prev => ({ 
                                        ...prev, 
                                        [key]: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                      }))
                                    }
                                  />
                                ) : (
                                  <Input
                                    id={key}
                                    value={triggerData[key] || ''}
                                    onChange={(e) => 
                                      setTriggerData(prev => ({ ...prev, [key]: e.target.value }))
                                    }
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleTriggerWorkflow}
                              disabled={runWorkflowMutation.isPending}
                            >
                              {runWorkflowMutation.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Running...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Workflow
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Command Execution */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Commands</CardTitle>
          <CardDescription>Execute custom commands and scripts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat Command</TabsTrigger>
              <TabsTrigger value="system">System Command</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chat-command">Chat Command</Label>
                <Textarea
                  id="chat-command"
                  placeholder="Enter a command for the AI assistant..."
                  className="min-h-[100px]"
                />
              </div>
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send to Assistant
              </Button>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-command">System Command</Label>
                <div className="flex gap-2">
                  <Select defaultValue="workflow">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workflow">Workflow</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="system-command"
                    placeholder="Enter command..."
                    className="flex-1"
                  />
                </div>
              </div>
              <Button className="w-full" variant="secondary">
                <Settings className="h-4 w-4 mr-2" />
                Execute Command
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}