const PaginationFooter = ({ paginationProps }) => {
  const {
    startIndex,
    itemsPerPage,
    totalItems,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
  } = paginationProps;

  if (totalItems === 0) return null;

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
      <span>
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {startIndex + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {Math.min(startIndex + itemsPerPage, totalItems)}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        entries
      </span>

      <div className="flex gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg"
        >
          Previous
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationFooter;
