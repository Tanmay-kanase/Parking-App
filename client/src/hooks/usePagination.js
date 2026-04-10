import { useState } from "react";

export default function usePagination(dataArray = [], itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataArray.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataArray.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    startIndex,
    paginatedData,
    handleNextPage,
    handlePrevPage,
    resetPage,
    totalItems: dataArray.length,
    itemsPerPage,
  };
}
