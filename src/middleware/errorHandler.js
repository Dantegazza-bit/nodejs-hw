import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  const status = isHttpError(err) ? err.status : 500;

  res.status(status).json({
    message: err.message,
  });
};
