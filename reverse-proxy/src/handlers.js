const http = require('http');

module.exports = (req, res) => {
  let service = req.service;

  const options = {
    hostname: service.host,
    port: service.port,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const request = http.request(options, (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    let data = "";
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      res.status(response.statusCode)
        .set(response.headers)
        .send(data)
    });
  });

  request.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  request.write(req.body);
  request.end();
}
