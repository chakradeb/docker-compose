FROM node:alpine

RUN npm install -g nodemon

WORKDIR /app

ENV PORT=8000

EXPOSE 8000

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]
