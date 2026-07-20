const fs = require('fs');
const path = require('path');

// Simulated Production Logger (APM like Datadog/Sentry)
const logDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });
const accessStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

const logger = {
  info: (message, meta = {}) => {
    const log = `[${new Date().toISOString()}] [INFO]: ${message} ${JSON.stringify(meta)}\n`;
    if (process.env.NODE_ENV !== 'production') console.log(log.trim());
    accessStream.write(log);
  },
  error: (message, error = {}) => {
    const log = `[${new Date().toISOString()}] [ERROR]: ${message} - ${error.stack || error.message || error}\n`;
    console.error(log.trim());
    errorStream.write(log);
  },
  warn: (message, meta = {}) => {
    const log = `[${new Date().toISOString()}] [WARN]: ${message} ${JSON.stringify(meta)}\n`;
    console.warn(log.trim());
    accessStream.write(log);
  }
};

module.exports = logger;
