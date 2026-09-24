#!/usr/bin/env bash
set -e

echo "Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

echo "Starting Apache..."
apache2-foreground
