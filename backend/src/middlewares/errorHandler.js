const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, `Rota não encontrada: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : 'Erro interno no servidor';

  if (!(err instanceof ApiError)) {
    console.error('Erro interno:', err);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = { notFound, errorHandler };
