interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({ value, showLabel = false, className = "" }: ProgressBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-200"
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-slate-600 w-9 text-right">{value}%</span>}
    </div>
  );
}
