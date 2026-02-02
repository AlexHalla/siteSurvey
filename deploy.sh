#!/bin/bash

# React application deployment script
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if directories exist
check_directories() {
    if [ ! -d "/var/www/html" ]; then
        error "Directory /var/www/html does not exist"
        exit 1
    fi
    
    if [ ! -d "./build" ]; then
        error "Directory ./build does not exist. Run npm run build first"
        exit 1
    fi
}

# Main deployment process
main() {
    log "Starting React application deployment"
    
    # Step 1: Git pull
    log "Executing git pull..."
    if ! git pull; then
        error "Failed to execute git pull"
        exit 1
    fi
    
    # Step 2: Install dependencies (optional)
    log "Checking dependencies..."
    if [ ! -d "node_modules" ]; then
        log "Installing npm dependencies..."
        npm install
    fi
    
    # Step 3: Build project
    log "Building project..."
    if ! npm run build; then
        error "Project build failed"
        exit 1
    fi
    
    # Check directories
    check_directories
    
    # Step 4: Backup (optional)
    if [ -d "/var/www/html" ] && [ "$(ls -A /var/www/html)" ]; then
        log "Creating backup of old version..."
        backup_dir="/var/www/backup_$(date +'%Y%m%d_%H%M%S')"
        sudo cp -r /var/www/html "$backup_dir"
        log "Backup created: $backup_dir"
    fi
    
    # Step 5: Clean target directory
    log "Cleaning /var/www/html..."
    sudo rm -rf /var/www/html/*
    
    # Step 6: Copy new version
    log "Copying new files..."
    sudo cp -r ./build/* /var/www/html/
    
    # Step 7: Set proper permissions
    log "Setting permissions..."
    sudo chown -R www-data:www-data /var/www/html/
    sudo chmod -R 755 /var/www/html/
    
    # Step 8: Verification
    if [ "$(ls -A /var/www/html)" ]; then
        log "Deployment completed successfully!"
        log "Files in /var/www/html:"
        ls -la /var/www/html/ | head -10
    else
        error "Target directory is empty after deployment!"
        exit 1
    fi
}

# Run script
main "$@"
