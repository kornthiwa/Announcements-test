import type { ChangeEvent } from "react";
import styles from "./announcements-pagination.module.css";

type AnnouncementsPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isDisabled: boolean;
  onPageSizeChange: (nextPageSize: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function AnnouncementsPagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  hasPreviousPage,
  hasNextPage,
  isDisabled,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: AnnouncementsPaginationProps) {
  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  return (
    <div className={styles.pagination}>
      <label className={styles.limitControl}>
        <span>Rows</span>
        <select
          className={styles.select}
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={isDisabled}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <button
        className={styles.button}
        type="button"
        onClick={onPreviousPage}
        disabled={!hasPreviousPage || isDisabled}
      >
        Previous
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={styles.button}
        type="button"
        onClick={onNextPage}
        disabled={!hasNextPage || isDisabled}
      >
        Next
      </button>
    </div>
  );
}
