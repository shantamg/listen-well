#!/bin/bash

# Run Prisma migrations for all environments

set -e

echo "Running Prisma migrations..."

cd "$(dirname "$0")/../backend"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

echo "Migrations complete!"
