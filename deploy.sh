#!/bin/bash

# MAXimum Security Calculator - Deployment Script
# This ensures consistent deployments every time

set -e  # Exit on any error

echo "🚀 Starting MAXimum Security Calculator Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✓"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

print_status "docker-compose is available ✓"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Remove old images to ensure fresh build
print_status "Cleaning up old images..."
docker image prune -f || true

# Build the application
print_status "Building MAXimum Security Calculator..."
docker-compose build --no-cache

# Start the application
print_status "Starting MAXimum Security Calculator..."
docker-compose up -d

# Wait for health check
print_status "Waiting for application to be healthy..."
sleep 10

# Check if the application is running
if docker-compose ps | grep -q "Up"; then
    print_success "MAXimum Security Calculator is running!"
    print_status "Application URL: http://localhost:3000"
    
    # Test the health endpoint
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Health check passed ✓"
    else
        print_warning "Health check failed - application may still be starting"
    fi
    
    # Show running containers
    print_status "Running containers:"
    docker-compose ps
    
else
    print_error "Failed to start the application"
    print_status "Container logs:"
    docker-compose logs
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
print_status "To view logs: docker-compose logs -f"
print_status "To stop: docker-compose down"
