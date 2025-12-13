FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build

FROM node:24-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm install    

COPY . .

CMD ["npm", "run", "start:dev"]

FROM node:24-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY doc ./dist/doc

CMD ["node", "dist/src/main.js"]