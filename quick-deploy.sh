#!/bin/bash

# Quick deployment script for development
echo "🔄 Quick Deploy - MAXimum Security Calculator"

# Stop, rebuild, and start
docker-compose down
docker-compose up --build -d

echo "✅ Quick deploy complete!"
echo "🌐 Application: http://localhost:3000"
