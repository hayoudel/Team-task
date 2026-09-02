export type ProjectStatus = "active" | "on_hold" | "completed";

const config: Record<ProjectStatus, { label: string; className: string }> = {
  active: { label: "Actif", className: "bg-blue-100 text-blue-700" },
  on_hold: { label: "En pause", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Terminé", className: "bg-emerald-100 text-emerald-700" },
};

export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
