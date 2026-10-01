const notFound = (req, _res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join('. ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID or value supplied';
  } else if (err.code === 11000) {
    status = 400;
    message = 'That value is already in use';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired session. Please log in again';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON in request body';
  }

  if (status >= 500) {
    console.error(err); // full details stay in the server log only
    message = 'Something went wrong on our side. Please try again';
  }
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
