import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): ApiError => {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`Error ${statusCode}: ${error.message}`);
  if (!isProduction) {
    console.error(error.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(isProduction ? {} : { stack: error.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};
