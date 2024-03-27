FROM node:18-alpine

RUN apk add -q --no-cache python3 py3-pip make g++

WORKDIR /usr/src/app

# Copy package.json, yarn.lock, and other necessary files
COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY .yarnrc.yml ./

# Replace legacy Yarn with modern one
RUN npm uninstall -g yarn
RUN corepack enable
RUN corepack prepare --activate yarn@stable

RUN yarn install --immutable

COPY . .

RUN yarn build

EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]
