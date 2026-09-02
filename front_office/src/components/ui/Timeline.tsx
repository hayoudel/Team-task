interface TimelineProps {
  steps: string[];
  activeIndex: number;
}

export default function Timeline({ steps, activeIndex }: TimelineProps) {
  const width = 640;
  const height = 90;
  const padding = 60;
  const usable = width - padding * 2;
  const stepX = (i: number) => padding + (usable / (steps.length - 1)) * i;
  const progressX = stepX(activeIndex);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <line x1={padding} y1={30} x2={width - padding} y2={30} stroke="#e2e8f0" strokeWidth={3} />
      <line x1={padding} y1={30} x2={progressX} y2={30} stroke="#F97316" strokeWidth={3} />
      {steps.map((label, i) => {
        const x = stepX(i);
        const isDone = i <= activeIndex;
        const isActive = i === activeIndex;
        return (
          <g key={label}>
            <circle
              cx={x}
              cy={30}
              r={isActive ? 9 : 7}
              fill={isDone ? "#F97316" : "#ffffff"}
              stroke={isDone ? "#F97316" : "#cbd5e1"}
              strokeWidth={2}
            />
            <text
              x={x}
              y={58}
              textAnchor="middle"
              fontSize={12}
              fontWeight={isActive ? 700 : 500}
              fill={isDone ? "#0f172a" : "#94a3b8"}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
