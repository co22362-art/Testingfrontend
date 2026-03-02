import { Plus, Search } from 'lucide-react';

interface PASidebarHeaderProps {
  title: string;
  onAdd?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function PASidebarHeader({
  title,
  onAdd,
  searchValue,
  onSearchChange
}: PASidebarHeaderProps) {
  return (
    <div className="px-4 pt-4 pb-3 border-b border-border">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3 min-h-8">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Add ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}