# BrainOps Dashboard Integration Guide

This document outlines the integration between the BrainOps Dashboard and the backend services.

## Overview

The BrainOps Dashboard is a comprehensive operational control center that provides real-time monitoring, workflow management, and administrative controls for the BrainOps AI Assistant system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BrainOps Dashboard                         │
│                   (Next.js + React)                          │
├─────────────────────────────────────────────────────────────┤
│  Components:                                                 │
│  - Health Status Monitor                                     │
│  - Workflow Queue Manager                                    │
│  - Activity Feed                                            │
│  - System Logs Viewer                                       │
│  - Trigger Controls                                         │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ HTTP/WebSocket
               │
┌──────────────▼──────────────────────────────────────────────┐
│                  BrainOps Backend API                        │
│                    (FastAPI)                                 │
├─────────────────────────────────────────────────────────────┤
│  Services:                                                   │
│  - Assistant Service                                         │
│  - Workflow Engine                                          │
│  - File Operations                                          │
│  - QA System                                                │
│  - Voice Interface                                          │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints Used

### System Status
- `GET /api/status` - Overall system status
- `GET /api/health` - Basic health check
- `GET /api/{service}/health` - Service-specific health

### Workflow Management
- `GET /api/workflows` - List workflows
- `POST /api/workflows/{id}/run` - Run workflow
- `GET /api/workflows/{id}/runs` - Get workflow runs
- `POST /api/workflows/runs/{id}/cancel` - Cancel workflow

### Assistant Operations
- `POST /api/assistant/sessions` - Create session
- `POST /api/assistant/sessions/{id}/chat` - Send message
- `GET /api/assistant/sessions/{id}/history` - Get history
- `WS /ws/assistant` - WebSocket for real-time chat

### Activity & Logging
- Real-time updates via WebSocket
- Activity feed populated from various service events
- System logs aggregated from all services

## Real-time Features

### WebSocket Integration
```javascript
// Connection to backend WebSocket
const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL)

// Listening for real-time updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Update dashboard components
}
```

### Auto-refresh Mechanism
- System status: 30-second intervals
- Workflow queue: 5-second intervals
- Activity feed: Real-time via WebSocket
- Configurable refresh rates

## Dashboard Features

### 1. Health Monitoring
- Real-time service status indicators
- Health percentage calculation
- Individual service restart capabilities
- Response time monitoring

### 2. Workflow Visualization
- Active workflow progress tracking
- Historical execution data
- Error details and logs
- Manual trigger interface

### 3. Activity Tracking
- Chronological event feed
- User action history
- System event notifications
- Filterable by service/type

### 4. System Logs
- Real-time log streaming
- Multi-level filtering (debug, info, warning, error)
- Search functionality
- Export capabilities

### 5. Administrative Controls
- Quick action buttons
- Manual workflow triggers
- Custom command execution
- Service management

## Deployment

### Environment Configuration
```env
# Production
NEXT_PUBLIC_API_URL=https://brainops-backend.onrender.com
NEXT_PUBLIC_WS_URL=wss://brainops-backend.onrender.com

# Development
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Deployment Options

#### Vercel
- Automatic deployments from Git
- Environment variable configuration
- Edge network distribution

#### Render
- Docker-based deployment
- Automatic SSL
- Health check monitoring

#### Docker
- Standalone container deployment
- Multi-stage build for optimization
- Production-ready configuration

## Security Considerations

1. **API Authentication**
   - Bearer token authentication
   - Secure WebSocket connections
   - CORS configuration

2. **Data Protection**
   - No sensitive data storage in frontend
   - Encrypted connections (HTTPS/WSS)
   - XSS protection headers

3. **Access Control**
   - User authentication required
   - Role-based access (when implemented)
   - Audit logging for actions

## Performance Optimizations

1. **Frontend**
   - Code splitting
   - Lazy loading
   - React Query caching
   - Optimized bundle size

2. **API Calls**
   - Request debouncing
   - Batch operations
   - Efficient polling strategies
   - WebSocket for real-time data

## Testing Strategy

1. **Unit Tests**
   - Component testing
   - Hook testing
   - Utility function testing

2. **Integration Tests**
   - API integration
   - WebSocket connectivity
   - Error handling

3. **E2E Tests** (Future)
   - User workflows
   - Real-time updates
   - Error scenarios

## Future Enhancements

1. **Features**
   - User management interface
   - Advanced analytics
   - Custom dashboard layouts
   - Mobile responsive design

2. **Integrations**
   - Third-party monitoring tools
   - Alerting systems
   - Export to external systems
   - API rate limiting display

3. **Performance**
   - Server-side rendering for initial load
   - Progressive Web App capabilities
   - Offline support
   - Advanced caching strategies

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check API URL configuration
   - Verify backend is running
   - Check CORS settings

2. **Real-time Updates Not Working**
   - Verify WebSocket URL
   - Check firewall/proxy settings
   - Ensure WebSocket support

3. **Authentication Errors**
   - Verify API tokens
   - Check session expiry
   - Review CORS configuration

### Debug Mode

Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'brainops:*')
```

## Support

For issues or questions:
- Check the README.md
- Review API documentation
- Contact the development team

---

Last Updated: [Current Date]
Version: 1.0.0