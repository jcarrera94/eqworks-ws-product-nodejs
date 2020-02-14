const rateLimit = (options) => {
  const originalMax = options.max;
  return test = (req, res, next) => {
    if (options.max <= 0) {
      res.status(429).end();
    } else {
      console.log('hits left:', options.max);
      if (options.max === originalMax) {
        setTimeout(() => {
          options.max = originalMax;
        }, options.timeLimit)
      }
      options.max--;
      next();
    }
  }
}

module.exports = rateLimit;