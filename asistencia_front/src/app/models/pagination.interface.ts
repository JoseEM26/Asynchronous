export interface PageRequest {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  filters?: { [key: string]: any };
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
  pageSize: number;
  filters?: { [key: string]: any };
}
