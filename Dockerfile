FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN apk update && apk add bash && npm install && npm install -g pm2

COPY . .

CMD ["pm2-runtime", "start", "dist/main.js", "--name", "bettermode-app"]