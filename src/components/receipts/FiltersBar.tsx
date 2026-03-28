import { cn } from "@/lib/utils";

interface Props {
  timeFilters: readonly string[] | string[];
  categoryFilters: readonly string[] | string[];
  activeTime: string;
  activeCategory: string;
  onTimeChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

const FiltersBar = ({ timeFilters, categoryFilters, activeTime, activeCategory, onTimeChange, onCategoryChange }: Props) => (
  <section className="space-y-3">
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {timeFilters.map((f) => (
        <button
          key={f}
          onClick={() => onTimeChange(f)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
            activeTime === f
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card/60 text-muted-foreground border-border/50 hover:bg-card"
          )}
        >
          {f}
        </button>
      ))}
      <div className="w-px bg-border/50 mx-1 shrink-0" />
      {categoryFilters.map((f) => (
        <button
          key={f}
          onClick={() => onCategoryChange(f)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
            activeCategory === f
              ? "bg-accent text-accent-foreground border-accent shadow-md"
              : "bg-card/60 text-muted-foreground border-border/50 hover:bg-card"
          )}
        >
          {f}
        </button>
      ))}
    </div>
  </section>
);

export default FiltersBar;
