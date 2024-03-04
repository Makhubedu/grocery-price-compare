# Use a smaller version of Node.js base image
FROM node:18.19.1-alpine

# Install necessary dependencies for X11 forwarding
RUN apk add --no-cache \
    xvfb \
    xauth \
    xorg-server \
    dbus \
    ttf-freefont

# Set environment variables for X11 forwarding
ENV DISPLAY=:99

ENV QT_X11_NO_MITSHM=1

# Install necessary dependencies
RUN apk update && apk add --no-cache \
    curl \
    gnupg \
    wget \
    ca-certificates \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Copy the start script into the container
COPY start.sh /start.sh

# Set execute permissions on the start script
RUN chmod +x /start.sh

EXPOSE 3000

# Create a user named 'app' to run the application
RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app

# Change ownership of the application directory to the 'app' user
RUN chown -R app:app /app

# Switch to the 'app' user
USER app

# Command to start the application
CMD ["/start.sh"]
