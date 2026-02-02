# Deployment Guide

This document describes how to build and deploy the current React app.

## 1) Configure the backend URL

Before deploying, set the correct backend base URL in:

`src/services/apt.ts`

Make sure the URL points to the production backend.

## 2) Build and deploy

Use the existing deployment script:

```bash
./deploy.sh
```

The script handles both build and deploy steps.

## Server requirement

The deployment server must already have Nginx configured to serve static files.

## 3) Verify

Open the deployed site and confirm:
- the app loads without errors
- API requests are sent to the production backend URL
