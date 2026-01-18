import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  const status = isHttpError(err) ? err.status : 500;

  const message = err.message ?? (isHttpError(err) ? err.name : 'Internal Server Error');

  res.status(status).json({
    message,
  });
};
