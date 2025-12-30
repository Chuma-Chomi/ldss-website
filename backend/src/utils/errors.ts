import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({ message: 'Internal server error' });
};
