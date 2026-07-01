"use client";

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
  } else if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  } else {
    pages.add(currentPage - 1);
    pages.add(currentPage + 1);
  }

  return [...pages].sort((left, right) => left - right);
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full border border-[#e8e1d6] bg-white px-4 py-2 text-sm font-semibold text-[#241f1a] transition hover:border-[#c1602f] hover:text-[#c1602f] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#e8e1d6] disabled:hover:text-[#241f1a]"
      >
        Previous
      </button>

      {pages.map((page, index) => {
        const active = page === currentPage;
        const previousPage = pages[index - 1];
        const showEllipsis = previousPage !== undefined && page - previousPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis ? (
              <span
                aria-hidden="true"
                className="inline-flex size-10 items-center justify-center text-sm font-semibold text-[#a39c91]"
              >
                ...
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={active ? "page" : undefined}
              className={`inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                active
                  ? "border-[#241f1a] bg-[#241f1a] text-white"
                  : "border-[#e8e1d6] bg-white text-[#241f1a] hover:border-[#c1602f] hover:text-[#c1602f]"
              }`}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full border border-[#e8e1d6] bg-white px-4 py-2 text-sm font-semibold text-[#241f1a] transition hover:border-[#c1602f] hover:text-[#c1602f] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#e8e1d6] disabled:hover:text-[#241f1a]"
      >
        Next
      </button>
    </nav>
  );
}
