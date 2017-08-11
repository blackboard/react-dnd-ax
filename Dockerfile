FROM node:6.11.2

WORKDIR /usr/app

COPY package.json .

RUN npm install --quiet

COPY . .

EXPOSE 9001
