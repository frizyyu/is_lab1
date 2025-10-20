export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  size: number;
  totalPages: number;
  totalSize: number;
}
