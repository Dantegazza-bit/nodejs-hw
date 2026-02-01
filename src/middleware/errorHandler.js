import { isCelebrateError } from 'celebrate';
import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  console.error('🔥 REAL ERROR:', err);
  console.error('🔥 STACK:', err.stack);

  if (isCelebrateError(err)) {
    const firstError = err.details.values().next().value;
    const message = firstError?.details?.[0]?.message || 'Validation error';
    return res.status(400).json({ message });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  return res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
};
