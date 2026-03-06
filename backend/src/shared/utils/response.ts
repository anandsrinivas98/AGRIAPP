import { Response } from 'express';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '../types/api';

export class ResponseUtil {
  static success<T>(res: Response, data?: T, message?: string, statusCode = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 400, errors?: Record<string, string[]>): void {
    const response: ApiResponse = {
      success: false,
      error: message,
      errors,
    };
    res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message?: string,
    statusCode = 200
  ): void {
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      pagination,
      message,
    };
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data?: T, message?: string): void {
    this.success(res, data, message, 201);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }

  static unauthorized(res: Response, message = 'Unauthorized'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden'): void {
    this.error(res, message, 403);
  }

  static notFound(res: Response, message = 'Resource not found'): void {
    this.error(res, message, 404);
  }

  static conflict(res: Response, message = 'Resource already exists'): void {
    this.error(res, message, 409);
  }

  static validationError(res: Response, errors: Record<string, string[]>): void {
    this.error(res, 'Validation failed', 422, errors);
  }

  static internalError(res: Response, message = 'Internal server error'): void {
    this.error(res, message, 500);
  }
}