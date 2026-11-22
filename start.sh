#!/bin/bash
set -e

# Cache configuration, routes, and views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force --seed

# Start Apache in foreground
apache2-foreground
