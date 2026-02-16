const getStatusCodeFromError = (error) => {
  const message = (error && error.message ? error.message : "").toLowerCase();

  if (message.includes("invalid credentials")) return 401;
  if (message.includes("access denied")) return 403;
  if (message.includes("not found") || message.includes("doesn't exist")) return 404;
  if (message.includes("already")) return 409;
  if (message.includes("required") || message.includes("cannot be empty")) return 400;

  return 500;
};

const sendError = (res, error) => {
  const statusCode = getStatusCodeFromError(error);
  return res.status(statusCode).json({
    error:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
};

module.exports = { getStatusCodeFromError, sendError };
