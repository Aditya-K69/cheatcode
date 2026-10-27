import type { RequestHandler } from "express";

const notFoundHandler: RequestHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);

  Object.assign(error, { status: 404 });

  next(error);
};

export default notFoundHandler;
