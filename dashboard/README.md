# BrainOps AI Assistant Dashboard

A production-grade operational dashboard for monitoring and managing the BrainOps AI Assistant system. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🎯 Core Functionality

- **Real-time System Monitoring**: Live health status for all backend services
- **Workflow Management**: View and manage active workflows, job queues, and execution history
- **Activity Tracking**: Recent system activity and comprehensive logging
- **Manual Controls**: Trigger workflows and execute administrative tasks
- **Performance Metrics**: Visual charts and statistics for system performance

### 📊 Dashboard Components

1. **Health Status Monitor**
   - Real-time service health indicators
   - Overall system health percentage
   - Individual service status with restart controls

2. **Workflow Queue**
   - Active workflows with progress tracking
   - Historical workflow execution data
   - Cancel and retry capabilities

3. **Activity Feed**
   - Chronological list of system events
   - User actions and system responses
   - Filterable by service and event type

4. **System Logs**
   - Real-time log streaming
   - Filterable by level, service, and search terms
   - Export functionality

5. **Trigger Controls**
   - Quick action buttons for common tasks
   - Manual workflow triggers with parameter configuration
   - Custom command execution interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI based)
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker, Vercel, Render

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (BrainOps AI Assistant)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd brainops-ai-assistant/dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend API URLs:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run test      # Run tests
npm run test:ci   # Run tests in CI mode
npm run type-check # Run TypeScript type checking
```

## Project Structure

```
dashboard/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main dashboard page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── health-status.tsx # Service health monitor
│   ├── workflow-queue.tsx # Workflow management
│   ├── recent-activity.tsx # Activity feed
│   ├── system-logs.tsx   # Log viewer
│   └── trigger-controls.tsx # Manual controls
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── __tests__/           # Test files
└── public/              # Static assets
```

## API Integration

The dashboard connects to the BrainOps backend API for:

- `/api/status` - System health status
- `/api/assistant/*` - AI assistant endpoints
- `/api/workflows/*` - Workflow management
- `/api/files/*` - File operations
- `/api/qa/*` - QA system endpoints

WebSocket connections are used for real-time updates.

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t brainops-dashboard .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend.com \
  brainops-dashboard
```

### Vercel

Deploy to Vercel:

```bash
vercel
```

Configure environment variables in Vercel dashboard.

### Render

1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `ws://localhost:8000` |

### Customization

- **Theme**: Modify `app/globals.css` for color scheme
- **Components**: Extend or modify components in `components/`
- **API Endpoints**: Update hooks in `hooks/` for different endpoints

## Performance

- Automatic code splitting and lazy loading
- Optimized bundle size with tree shaking
- Image optimization with Next.js Image component
- API response caching with React Query
- Real-time updates via WebSocket connections

## Security

- CORS configuration for API requests
- XSS protection headers
- Content Security Policy
- Secure WebSocket connections in production
- No sensitive data stored in frontend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

[License information]

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for BrainOps AI Assistant