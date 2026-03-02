Update src/app/modules/3003_mail/MailPage.tsx.

In the left sub-panel that contains the PAProjectTree, replace any existing
filter UI with the exact same pattern used in the Projects page sidebar header.

--- FILTER STATE ---

const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['ongoing'])
const [filterOpen, setFilterOpen] = useState(false)

const toggleStatus = (status: string) => {
  setSelectedStatuses(prev =>
    prev.includes(status)
      ? prev.length === 1 ? prev
      : prev.filter(s => s !== status)
      : [...prev, status]
  )
}

const filterLabel = selectedStatuses.length === 1
  ? `${selectedStatuses[0].charAt(0).toUpperCase() + selectedStatuses[0].slice(1)} Projects`
  : 'Projects'

--- HEADER ROW ---

Replace the sub-panel header with a clickable title that opens a dropdown,
identical to the Projects page:

<div className="relative">
  <button
    onClick={() => setFilterOpen(prev => !prev)}
    className="flex items-center gap-2 px-2 py-1.5 w-full hover:bg-accent/50 rounded"
  >
    <span className="font-semibold text-sm flex-1 text-left">{filterLabel}</span>
    <ChevronDown className="size-4 text-muted-foreground" />
  </button>

  {filterOpen && (
    <div className="absolute top-full left-0 z-50 bg-popover border border-border
                    rounded-md shadow-md py-1 min-w-[160px]">
      {(['ongoing', 'completed', 'archived'] as const).map(status => (
        <button
          key={status}
          onClick={() => toggleStatus(status)}
          className="flex items-center gap-2 px-3 py-1.5 w-full hover:bg-accent/50 text-sm capitalize"
        >
          <div className={cn(
            "size-4 rounded border flex items-center justify-center",
            selectedStatuses.includes(status)
              ? "bg-primary border-primary"
              : "border-border"
          )}>
            {selectedStatuses.includes(status) && (
              <Check className="size-3 text-primary-foreground" />
            )}
          </div>
          {status}
        </button>
      ))}
    </div>
  )}
</div>

Close the dropdown when clicking outside (use a useEffect with a document
click listener, or wrap with an onBlur handler).

--- SEARCH BOX ---

Below the header, keep or add the search box (same as Projects page):
<div className="px-2 pb-1">
  <div className="flex items-center gap-2 border border-border rounded-md px-2 py-1">
    <Search className="size-3.5 text-muted-foreground" />
    <input
      className="text-xs bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
      placeholder="Search..."
    />
  </div>
</div>

--- FILTER GROUPS ---

const filteredGroups = mockProjectGroups.map(group => ({
  ...group,
  projects: group.projects.filter(p => selectedStatuses.includes(p.status))
})).filter(group => group.projects.length > 0)

Pass showStatusBadge={selectedStatuses.length > 1} to PAProjectTree.

Do not change any other part of the MailPage layout.
