const mcache = require('memory-cache');

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.setHeader('Content-Type', 'application/json');
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        // Cache for specified duration (in seconds)
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

module.exports = cacheMiddleware;
