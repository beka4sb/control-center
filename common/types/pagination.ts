export type Cursor = {
  start: string | null;
  end: string | null;
};

export type PaginatedResult<T> = {
  data: T[];
  cursor: Cursor;
  totalItems: number;
};

export type InfinitePaginationResult<T> = {
  data: T[];
  cursor: string | null;
  hasNextPage: boolean;
  totalItems: number;
};
