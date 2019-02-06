const http = require('http');
const path = require('path');

const { Client } = require('pg');

const app = require(path.resolve('app.js'));

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

const connectionString = DATABASE_URL;

const client = new Client(connectionString);
client.connect();

app.initialize(client);
const server = http.createServer(app);
server.listen(PORT);
console.log(`Server Listening on port ${PORT}`);
console.log(`Connection String is ${connectionString}`)
