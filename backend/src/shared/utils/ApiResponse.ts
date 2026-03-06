import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any = null, message: string = 'Success'): void {
    res.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message: string = 'Error', statusCode: number = 500, errors?: any): void {
    res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static paginated(res: Response, data: any[], pagination: any, message: string = 'Success'): void {
    res.json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  }

  static created(res: Response, data: any = null, message: string = 'Created successfully'): void {
    res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): void {
    this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Resource not found'): void {
    this.error(res, message, 404);
  }

  static conflict(res: Response, message: string = 'Resource already exists'): void {
    this.error(res, message, 409);
  }

  static validationError(res: Response, errors: any, message: string = 'Validation failed'): void {
    this.error(res, message, 422, errors);
  }
}