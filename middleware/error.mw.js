// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.name === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 404;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
