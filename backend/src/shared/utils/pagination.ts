import { PaginationParams, PaginationMeta } from '../types/api';

export class PaginationUtil {
  static getSkipTake(params: PaginationParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;
    
    return { skip, take: limit, page, limit };
  }

  static createMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const pages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }

  static getSortOrder(params: PaginationParams) {
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
    
    return { [sortBy]: sortOrder };
  }
}