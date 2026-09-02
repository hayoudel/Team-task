import { Inbox } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 px-4">
      <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mb-3">
        {icon ?? <Inbox className="w-5 h-5" />}
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description && <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
