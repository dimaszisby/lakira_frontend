// components/Pagination.tsx
export function Pagination({
    page,
    total,
    pageSize,
    onChange,
  }: {
    page: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  }) {
    const totalPages = Math.ceil(total / pageSize);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(page - i) <= 2) {
        pageNumbers.push(i);
      } else if (
        (i === 2 && page > 4) ||
        (i === totalPages - 1 && page < totalPages - 3)
      ) {
        pageNumbers.push("...");
      }
    }
    return (
      <nav className="flex items-center justify-center mt-8 space-x-1">
        {pageNumbers.map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={num}
              className={`px-3 py-1 rounded-lg ${
                page === num
                  ? "bg-purple-200 text-purple-800 font-bold"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => onChange(Number(num))}
              disabled={page === num}
            >
              {num}
            </button>
          )
        )}
      </nav>
    );
  }
  