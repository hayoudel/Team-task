interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative pb-3 text-sm font-medium transition-all duration-200 ${
            active === tab ? "text-orange-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab}
          {active === tab && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-orange-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
