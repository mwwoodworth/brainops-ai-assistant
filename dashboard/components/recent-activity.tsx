'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Workflow, 
  FileText, 
  Mic, 
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Bot,
  Activity as ActivityIcon
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  id: string
  type: 'chat' | 'workflow' | 'file' | 'voice' | 'system'
  action: string
  description: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  status?: 'success' | 'error' | 'warning'
  metadata?: Record<string, any>
}

const activityIcons = {
  chat: MessageSquare,
  workflow: Workflow,
  file: FileText,
  voice: Mic,
  system: Bot,
}

const activityColors = {
  chat: 'bg-blue-500',
  workflow: 'bg-purple-500',
  file: 'bg-green-500',
  voice: 'bg-orange-500',
  system: 'bg-gray-500',
}

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Simulated data - replace with actual API call
      return [
        {
          id: '1',
          type: 'chat',
          action: 'New conversation started',
          description: 'User initiated chat session about project requirements',
          user: { id: 'user1', name: 'John Doe' },
          timestamp: new Date(Date.now() - 300000).toISOString(),
          status: 'success',
        },
        {
          id: '2',
          type: 'workflow',
          action: 'Workflow triggered',
          description: 'Daily report generation workflow started',
          user: { id: 'system', name: 'System' },
          timestamp: new Date(Date.now() - 600000).toISOString(),
          status: 'success',
        },
        {
          id: '3',
          type: 'file',
          action: 'File uploaded',
          description: 'Uploaded requirements.pdf (2.4 MB)',
          user: { id: 'user2', name: 'Jane Smith' },
          timestamp: new Date(Date.now() - 900000).toISOString(),
          status: 'success',
        },
        {
          id: '4',
          type: 'voice',
          action: 'Voice session ended',
          description: 'Voice interaction completed (duration: 5m 23s)',
          user: { id: 'user1', name: 'John Doe' },
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          status: 'success',
        },
        {
          id: '5',
          type: 'system',
          action: 'Service restarted',
          description: 'Assistant service was restarted due to configuration update',
          user: { id: 'admin', name: 'Admin' },
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          status: 'warning',
        },
        {
          id: '6',
          type: 'workflow',
          action: 'Workflow failed',
          description: 'Email notification workflow failed to complete',
          user: { id: 'system', name: 'System' },
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          status: 'error',
        },
      ]
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-3 w-3" />
      case 'error':
        return <AlertCircle className="h-3 w-3" />
      case 'warning':
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusVariant = (status?: string): any => {
    switch (status) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      case 'warning':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and events in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-muted-foreground">Loading activities...</div>
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type]
                const iconBg = activityColors[activity.type]
                
                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {activities.indexOf(activity) < activities.length - 1 && (
                        <div className="absolute top-10 left-5 w-0.5 h-full bg-border -translate-x-1/2" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{activity.action}</p>
                          {activity.status && (
                            <Badge variant={getStatusVariant(activity.status)} className="h-5">
                              {getStatusIcon(activity.status)}
                              <span className="ml-1 capitalize">{activity.status}</span>
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <ActivityIcon className="h-12 w-12 mb-2" />
              <p>No recent activity</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}