function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { httpError, asyncHandler };
