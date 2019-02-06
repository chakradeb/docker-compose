const express = require('express');
const morgan = require('morgan');

const app = express();

app.initialize = function(client) {
    app.client = client;
};

app.use(express.urlencoded({
    extended: false
}));
app.use(morgan('combined'));
app.use(express.static('public'));
app.get('/numbers',(req,res) => {
    let client = req.app.client;
    client.query(`select * from app_data`)
    .then(data => {
        console.log(data.rows);
        let html = data.rows.map((row) => `<h1>${row.data}</h1>`)
        res.send(html.join(''));
    });
})
app.post('/',(req,res) => {
    let client = req.app.client;
    client.query(`create table if not exists app_data (data numeric)`)
    .then(res => client.query(`insert into app_data values($1)`,[req.body.number]))
    res.redirect('/');
})

module.exports = app;
