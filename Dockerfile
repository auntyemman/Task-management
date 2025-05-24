# Stage 1: Builder
FROM node:22.13.1-alpine3.21 AS builder

WORKDIR /usr/src/app

COPY package-lock.yaml package.json ./

RUN npm install --network-concurrency 1

COPY . .

RUN pnpm run build

# Stage 2: Production image
FROM node:22.13.1-alpine3.21

WORKDIR /usr/src/app

COPY package-lock.yaml package.json ./

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Start the application
ENTRYPOINT [ "node" ]
CMD ["dist/main.js"]