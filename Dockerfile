FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY ./src ./src
COPY package-lock.json .
COPY ./public ./public

RUN npm install
EXPOSE 3000

COPY . .

CMD [ "npm", "start" ]

