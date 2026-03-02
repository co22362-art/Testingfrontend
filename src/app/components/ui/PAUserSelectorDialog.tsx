import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Skeleton } from './skeleton';

interface User {
  id: string;
  name: string;
  initials: string;
  subtitle?: string;
}

interface PAUserSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  users: User[];
  onSelect: (user: User) => void;
  excludeIds?: string[];
  isLoading?: boolean;
}

export default function PAUserSelectorDialog({
  open,
  onOpenChange,
  title,
  users,
  onSelect,
  excludeIds = [],
  isLoading = false,
}: PAUserSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query and excluded IDs
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return users
      .filter(user => !excludeIds.includes(user.id))
      .filter(user => 
        user.name.toLowerCase().includes(query) ||
        (user.subtitle && user.subtitle.toLowerCase().includes(query))
      );
  }, [users, excludeIds, searchQuery]);

  // Handle user selection
  const handleSelectUser = (user: User) => {
    onSelect(user);
    setSearchQuery(''); // Reset search
    onOpenChange(false); // Close dialog
  };

  // Reset search when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Select a user from the list below.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full h-10 pl-10 pr-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="px-6 pb-6">
          <div className="max-h-[360px] overflow-y-auto -mx-2 px-2">
            {isLoading ? (
              // Loading State
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 px-3">
                    <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              // Empty State
              <div className="flex items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              // User Rows
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {user.initials}
                    </div>

                    {/* Name and Subtitle */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      {user.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}