type Size = "xs" | "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

const palette = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  return (
    <div
      title={name}
      className={`flex items-center justify-center rounded-full font-semibold shrink-0 ring-2 ring-white ${sizeClasses[size]} ${colorFor(
        name
      )} ${className}`}
    >
      {initials(name)}
    </div>
  );
}
