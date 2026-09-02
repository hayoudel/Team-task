import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page?: number;
  totalPages?: number;
}

export default function Pagination({ page = 1, totalPages = 3 }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Page {page} sur {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-all duration-200">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 ${
              p === page ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-all duration-200">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
