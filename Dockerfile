FROM node:18-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 5000

# VOLUME [ "/node_modules" ]

CMD [ "npm", "start" ]