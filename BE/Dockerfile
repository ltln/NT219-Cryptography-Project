# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install required packages
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the app (assumes output goes to /usr/src/app/dist)
RUN npm run build

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of built files
RUN chown -R appuser:appgroup /usr/src/app

# Stage 2: Create a lightweight runtime image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Create the same non-root user in runtime stage
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built files from builder stage, with proper ownership
COPY --from=builder --chown=appuser:appgroup /usr/src/app .

# Use non-root user
USER appuser

# Expose port and run the app
EXPOSE 3000
CMD ["node", "dist/src/main"]
