const http = require('http');
const querystring = require('querystring');

const getHandler = function(service) {
    return (req,res) => {
        http.get(`http://${service.host}:${service.port}${req.url}`, (response) => {
            const { statusCode } = response;
    
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
            }
            if (error) {
                console.error(error.message);
                response.resume();
                return;
            }
    
            response.setEncoding('utf8');
            let rawData = '';
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                res.send(rawData)
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
    }
}

const postHandler = function(service) {
    return (req,res) => {
        const postData = querystring.stringify({
            'number': req.body.number
        });
          
        const options = {
            hostname: service.host,
            port: service.port,
            path: req.url,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
        };
          
        const request = http.request(options, (response) => {
            console.log(`STATUS: ${response.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
              console.log(`BODY: ${chunk}`);
            });
            response.on('end', () => {
              res.redirect('/');
            });
        });

        request.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        request.write(postData);
        request.end();
    }
}

module.exports = {
    getHandler,
    postHandler
}