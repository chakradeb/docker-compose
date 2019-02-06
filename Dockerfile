FROM node:alpine

WORKDIR /app

ENV PORT=8000

EXPOSE 8000

ADD package.json package.json

RUN npm install

ADD . .

ENTRYPOINT ["npm", "start"]
