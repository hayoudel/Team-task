import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "danger" | "success";
}

const toneClasses: Record<string, string> = {
  default: "text-slate-900",
  danger: "text-red-500",
  success: "text-emerald-500",
};

export default function StatCard({ label, value, icon, tone = "default" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {icon && <div className="text-orange-400">{icon}</div>}
      </div>
      <p className={`text-3xl font-black ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}
