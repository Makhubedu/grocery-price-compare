#!/bin/sh

# Start Xvfb (X virtual framebuffer) in the background
Xvfb :99 -screen 0 1280x720x16 &

# Run your application
exec npm start
