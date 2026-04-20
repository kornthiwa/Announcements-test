import { useEffect, useMemo, useState } from "react";
import styles from "./home-page.module.css";
import { AnnouncementsPagination } from "./components/announcements-pagination";
import { AnnouncementsTable } from "./components/announcements-table";
import { DEFAULT_POSTS_PAGE_SIZE, POSTS_PAGE_SIZE_OPTIONS } from "./constants";
import { useAnnouncementsQuery } from "./hooks/use-announcements-query";

function clampPage(page: number, totalPages: number) {
  const safeTotalPages = Math.max(totalPages, 1);
  return Math.min(Math.max(page, 1), safeTotalPages);
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_POSTS_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isPending, isError, error, isFetching } = useAnnouncementsQuery(
    currentPage,
    pageSize,
    searchTerm,
  );

  const totalPages = useMemo(() => {
    if (!data?.data?.total) {
      return 1;
    }

    return Math.ceil(data.data.total / pageSize);
  }, [data?.data?.total, pageSize]);

  useEffect(() => {
    setCurrentPage((previousPage) => clampPage(previousPage, totalPages));
  }, [totalPages]);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePreviousPage = () => {
    if (!hasPreviousPage || isFetching) {
      return;
    }

    setCurrentPage((previousPage) => clampPage(previousPage - 1, totalPages));
  };

  const handleNextPage = () => {
    if (!hasNextPage || isFetching) {
      return;
    }

    setCurrentPage((previousPage) => clampPage(previousPage + 1, totalPages));
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    if (
      !(POSTS_PAGE_SIZE_OPTIONS as readonly number[]).includes(nextPageSize) ||
      isFetching
    ) {
      return;
    }

    setPageSize(nextPageSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isPending) {
    return (
      <section className={styles.wrapper}>Loading announcements...</section>
    );
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Unexpected request error";

    return <section className={styles.wrapper}>Error: {message}</section>;
  }

  return (
    <section className={styles.wrapper} id="home">
      <h1 className={styles.title}>Announcements Table</h1>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>
      <AnnouncementsTable
        announcements={data?.data?.data ?? []}
        isDisabled={isFetching}
      />
      <AnnouncementsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={POSTS_PAGE_SIZE_OPTIONS}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        isDisabled={isFetching}
        onPageSizeChange={handlePageSizeChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </section>
  );
}
