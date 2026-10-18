const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const tarih = new Date();
  console.log(method, url, tarih);
  next();
};
module.exports = logger;
