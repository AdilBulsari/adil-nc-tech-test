const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const customError = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "server error",
  };

  if (err.status && err.message) {
    res.status(customError.status).send({
      message: customError.message,
    });
  }
};

module.exports = errorHandler;
