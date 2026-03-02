interface Tag {
  label: string;
  variant?: 'default' | 'warning';
}

interface PASidebarCardProps {
  initials: string;
  title: string;
  subtitle: string;
  isSelected?: boolean;
  badgeCount?: number;
  tags?: Tag[];
  actions?: React.ReactNode;
  onClick?: () => void;
}

export default function PASidebarCard({
  initials,
  title,
  subtitle,
  isSelected = false,
  badgeCount,
  tags,
  actions,
  onClick
}: PASidebarCardProps) {
  return (
    <div
      className={`w-full px-3 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 relative ${
        isSelected ? 'border-l-[3px] border-l-primary' : ''
      }`}
    >
      {/* Clickable overlay for main click area */}
      {onClick && (
        <div
          onClick={onClick}
          className="absolute inset-0 rounded-lg cursor-pointer"
          aria-label={`Select ${title}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
        />
      )}

      {/* Avatar Circle */}
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0 relative z-10 pointer-events-none">
        {initials}
      </div>

      {/* Title and Subtitle */}
      <div className="flex-1 min-w-0 relative z-10 pointer-events-none">
        <p className="font-medium text-sm text-foreground truncate">
          {title}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground truncate">
            {subtitle}
          </span>
          {tags && tags.length > 0 && (
            <>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={
                    tag.variant === 'warning'
                      ? 'text-orange-500 text-xs font-medium'
                      : 'border border-border text-muted-foreground text-xs rounded-full px-2 py-0.5'
                  }
                >
                  {tag.label}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Badge Count and Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 relative z-10 pointer-events-auto">
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="bg-muted text-muted-foreground rounded-full text-xs px-2 py-0.5 font-medium pointer-events-none">
            {badgeCount}
          </span>
        )}
        {actions}
      </div>
    </div>
  );
}