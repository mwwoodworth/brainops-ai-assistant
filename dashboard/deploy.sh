#!/bin/bash

# BrainOps Dashboard Deployment Script
set -e

echo "🚀 BrainOps Dashboard Deployment"
echo "================================"

# Function to display usage
usage() {
    echo "Usage: $0 [vercel|render|docker]"
    echo "  vercel - Deploy to Vercel"
    echo "  render - Deploy to Render"
    echo "  docker - Build and run Docker container"
    exit 1
}

# Check if deployment target is provided
if [ $# -eq 0 ]; then
    usage
fi

DEPLOY_TARGET=$1

case $DEPLOY_TARGET in
    vercel)
        echo "📦 Deploying to Vercel..."
        
        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not found. Installing..."
            npm i -g vercel
        fi
        
        # Deploy to Vercel
        vercel --prod
        
        echo "✅ Deployment to Vercel complete!"
        ;;
        
    render)
        echo "📦 Preparing for Render deployment..."
        
        # Build Docker image
        echo "🐳 Building Docker image..."
        docker build -t brainops-dashboard .
        
        echo "✅ Docker image built successfully!"
        echo ""
        echo "📝 Next steps for Render deployment:"
        echo "1. Push your code to GitHub"
        echo "2. Connect your GitHub repo to Render"
        echo "3. Use the render.yaml configuration"
        echo "4. Set environment variables in Render dashboard:"
        echo "   - NEXT_PUBLIC_API_URL"
        echo "   - NEXT_PUBLIC_WS_URL"
        ;;
        
    docker)
        echo "🐳 Building and running Docker container..."
        
        # Build Docker image
        docker build -t brainops-dashboard .
        
        # Stop existing container if running
        docker stop brainops-dashboard 2>/dev/null || true
        docker rm brainops-dashboard 2>/dev/null || true
        
        # Run new container
        docker run -d \
            --name brainops-dashboard \
            -p 3000:3000 \
            -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000} \
            -e NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-ws://localhost:8000} \
            brainops-dashboard
        
        echo "✅ Dashboard is running at http://localhost:3000"
        echo ""
        echo "📝 To view logs: docker logs -f brainops-dashboard"
        echo "📝 To stop: docker stop brainops-dashboard"
        ;;
        
    *)
        echo "❌ Unknown deployment target: $DEPLOY_TARGET"
        usage
        ;;
esac

echo ""
echo "🎉 Deployment script completed!"