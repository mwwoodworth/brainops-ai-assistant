'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Download, 
  Filter, 
  RefreshCw,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

interface LogEntry {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warning' | 'error'
  service: string
  message: string
  metadata?: Record<string, any>
}

const levelIcons = {
  debug: Info,
  info: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const levelColors = {
  debug: 'text-blue-500',
  info: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
}

const levelBadgeVariants: Record<string, any> = {
  debug: 'secondary',
  info: 'default',
  warning: 'outline',
  error: 'destructive',
}

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [autoScroll, setAutoScroll] = useState(true)

  const { data: logs, isLoading, refetch } = useQuery<LogEntry[]>({
    queryKey: ['system-logs', levelFilter, serviceFilter],
    queryFn: async () => {
      // Simulated data - replace with actual API call
      return [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'assistant',
          message: 'New chat session created for user 123',
          metadata: { userId: '123', sessionId: 'abc-123' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          level: 'warning',
          service: 'workflow',
          message: 'Workflow execution took longer than expected',
          metadata: { workflowId: 'wf-001', duration: '5.2s' }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'error',
          service: 'voice',
          message: 'Failed to initialize voice synthesis engine',
          metadata: { error: 'Connection timeout' }
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 90000).toISOString(),
          level: 'debug',
          service: 'files',
          message: 'File upload completed successfully',
          metadata: { filename: 'document.pdf', size: '2.4MB' }
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'info',
          service: 'qa',
          message: 'Knowledge base indexed successfully',
          metadata: { documents: 156, indexTime: '3.4s' }
        },
      ]
    },
    refetchInterval: autoScroll ? 5000 : false,
  })

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter
    return matchesSearch && matchesLevel && matchesService
  }) || []

  const services = Array.from(new Set(logs?.map(log => log.service) || []))

  const handleExport = () => {
    const exportData = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      service: log.service,
      message: log.message,
      ...log.metadata
    }))
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Real-time system event monitoring</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
            >
              {autoScroll ? 'Auto-scroll On' : 'Auto-scroll Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map(service => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Log entries */}
          <ScrollArea className="h-[400px] rounded-md border p-4 font-mono text-sm">
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No logs matching the current filters
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map(log => {
                  const Icon = levelIcons[log.level]
                  const color = levelColors[log.level]
                  
                  return (
                    <div key={log.id} className="flex items-start space-x-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
                      </span>
                      <Icon className={`h-4 w-4 ${color} mt-0.5`} />
                      <Badge variant={levelBadgeVariants[log.level]} className="text-xs">
                        {log.level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.service}
                      </Badge>
                      <span className="flex-1 break-all">{log.message}</span>
                      {log.metadata && (
                        <code className="text-xs text-muted-foreground">
                          {JSON.stringify(log.metadata)}
                        </code>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}