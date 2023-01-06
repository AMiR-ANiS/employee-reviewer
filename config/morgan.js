// morgan logger config file for generating production logs

const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDir = path.join(__dirname, '..', 'production_logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir);

const stream = rfs.createStream('access.log', {
  path: logDir,
  interval: '1d',
  size: '1M'
});

module.exports = {
  mode: 'combined',
  options: {
    stream
  }
};
