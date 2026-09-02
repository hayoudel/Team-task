export type TaskStatus = "todo" | "in_progress" | "done";

const config: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "À faire", className: "bg-slate-100 text-slate-600" },
  in_progress: { label: "En cours", className: "bg-amber-100 text-amber-700" },
  done: { label: "Terminé", className: "bg-emerald-100 text-emerald-700" },
};

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
