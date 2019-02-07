const fs = require('fs');
const http = require('http');

let config = require('../config.json');

const serviceCycler = (services, watcher) => {
  let index = services.length - 1;

  watcher.on("change", (filename) => {
    config = fs.readFile(filename, 'utf8', (err, content) => {
      if (!err) {
        services = serviceCycler(JSON.parse(content).services);
      };
    });
  });

  const cycler = () => {
    index = (++index) % services.length;
    return services[index];
  }

  cycler.count = () => services.length;
  
  return cycler;
}

let nextService = serviceCycler(config.services, fs.watch("./config.json"));

const nextRunningService = (cb,fb, trials = nextService.count()) => {
  if(trials == 0) {
    fb();
    return;
  }
  let service = nextService();
  var req = http.get(`http://${service.host}:${service.port}/health`, () => cb(service));

  req.on('socket', function (socket) {
    socket.setTimeout(100);
    socket.on('timeout', () => req.abort());
  });

  req.on('error', (err) => nextRunningService(cb, fb, --trials));

  req.end();
}

module.exports = nextRunningService;
