# Use the official Node.js 16 image as a parent image
FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip make g++

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, yarn.lock, and other necessary files
COPY package.json ./
COPY yarn.lock ./
COPY .env ./

# Install dependencies
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Build the Next.js application
RUN yarn build

# Command to run the app
CMD ["node", "index.js"]
