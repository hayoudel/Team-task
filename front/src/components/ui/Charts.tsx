export function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; colorClass: string; hex: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-8">
      <svg viewBox="0 0 160 160" className="w-40 h-40 shrink-0 -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {segments.map((seg) => {
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={seg.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.hex}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="space-y-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${seg.colorClass}`} />
            <span className="text-sm text-slate-600">{seg.label}</span>
            <span className="text-sm font-semibold text-slate-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectProgressChart({ data }: { data: { name: string; value: number; colorClass: string }[] }) {
  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.name}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-600 truncate">{d.name}</span>
            <span className="text-sm font-semibold text-slate-900">{d.value}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${d.colorClass} transition-all duration-500`} style={{ width: `${d.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
