FROM node:alpine

WORKDIR /app

ENV PORT=8000

EXPOSE 8000

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]
