FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /usr/src/app

# Copy package.json, yarn.lock, and other necessary files
COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY .husky ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]
