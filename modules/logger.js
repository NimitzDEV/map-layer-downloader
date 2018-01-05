const winston = require('winston');

require('fs').existsSync('./logs') || require('fs').mkdirSync('./logs');

let filename = (function() {
  let d = new Date();
  return `./logs/${d.getFullYear()}-${d.getMonth() +
    1}-${d.getDate()}-ERROR.txt`;
})();

let logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename, level: 'error' }),
  ],
});

module.exports = logger;
