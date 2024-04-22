FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn run build

FROM node:alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "run", "start:dev"]
