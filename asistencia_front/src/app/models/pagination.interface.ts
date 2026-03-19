export interface PageRequest {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  filter?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageIndex: number;
  totalItems: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
  pageSize: number;
  filters?: any;
}
