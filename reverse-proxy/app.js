const express = require('express');
const morgan = require('morgan');

const lib = require('./src/handlers.js');
const config = require('./config.json');

const app = express();

let services = config.services;
let serviceIndex = 0;

app.use(express.urlencoded({
    extended: false
}));
app.use(morgan('combined'));
app.use((req,res,next) => {
    serviceIndex++;
    next();
});

app.get('/',lib.getHandler(services[serviceIndex]))
app.get('/numbers',lib.getHandler(services[serviceIndex]))
app.get('/health',lib.getHandler(services[serviceIndex]))

app.post('/',lib.postHandler(services[serviceIndex]))

module.exports = app;
