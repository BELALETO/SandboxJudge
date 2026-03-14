FROM node:18-alpine

WORKDIR /app

# install docker CLI so Node can spawn docker
RUN apk add --no-cache docker-cli

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 5000

CMD ["npm", "run", "start:all"]