const express = require('express');
const morgan = require('morgan');

const handler = require('./src/handlers.js');
const cycler = require('./src/cycler.js');

const app = express();

app.use((req, _res, next) => {
  req.body = "";
  req.on("data", (chunk) => req.body += chunk);
  req.on("end", () => next());
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  cycler((service) => {
    req.service = service;
    console.log(`Forwarding to ${service.host}...`);
    next();
  }, () => {
    console.log("Failed to find any running service");
    res.status(500).send("Internal server error");
  });
});

app.use(handler);

module.exports = app;
