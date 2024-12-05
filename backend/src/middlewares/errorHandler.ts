import { Request, Response, NextFunction } from "express";

// Interface pour les erreurs
interface Error {
  status?: number;
  message?: string;
}

// Middleware pour gérer les erreurs
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("An error occurred:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log supplémentaire pour debugging
  console.error("Status Code:", statusCode);
  console.error("Message:", message);

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};


export default errorHandler;
