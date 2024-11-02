FROM node:18-alpine

WORKDIR /app


COPY package.json .
COPY ./src ./src
COPY package-lock.json .
COPY ./public ./public

RUN npm install

COPY . .

CMD [ "npm", "start" ]

