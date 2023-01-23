import { Request, Response, NextFunction, RequestHandler } from "express";

class APIError extends Error {
  statusCode: number;
  body?: object;

  constructor(
    message: string,
    option?: {
      statusCode?: number;
      body?: object;
    }
  ) {
    super(message);
    this.statusCode = option?.statusCode || 500;
    this.body = option?.body;
  }
}

const use =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

function errorHandler(
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: `${statusCode === 500 ? "[Server Error] " : ""}${err.message}`,
    body: err.body,
  });
}

export { APIError, use, errorHandler };
