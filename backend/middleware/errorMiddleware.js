const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Log to production monitor
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err);

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
