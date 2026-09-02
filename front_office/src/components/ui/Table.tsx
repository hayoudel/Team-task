import { ReactNode } from "react";
import EmptyState from "./EmptyState";

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  children: ReactNode;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function Table({
  columns,
  children,
  empty = false,
  emptyTitle = "Aucun élément",
  emptyDescription = "Il n'y a rien à afficher ici pour le moment.",
}: TableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left font-medium text-slate-500 px-5 py-3 ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {empty && (
        <div className="py-10">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </div>
  );
}
