import { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  Inbox, 
  Send, 
  FileText, 
  Star, 
  Archive, 
  Trash2, 
  Tag,
  Search,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Download,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Mail,
  ArrowUpDown,
  X,
  Check
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import PAProjectTree, { PAProjectGroup, PATreeNode } from '@/app/components/ui/PAProjectTree';
import { cn } from '../../components/ui/utils';
import { mockProjectGroups } from '@/app/data/mockProjectData';
import { 
  mockProjectLabels, 
  mockMailFolders, 
  mockMailLabels, 
  mockEmails,
  type MailFolder,
  type MailLabel,
  type MailEmail
} from '@/app/data/mockMailData';

// Types
type ProjectStatus = 'Ongoing' | 'Completed' | 'Archived';

interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
}

interface Year {
  year: number;
  projects: Project[];
}

interface ProjectGroup {
  id: string;
  name: string;
  years: Year[];
}

interface MailPageProps {
  emails?: MailEmail[];
  folders?: MailFolder[];
  labels?: MailLabel[];
  onCompose?: () => void;
  onReply?: (emailId: string, message: string) => void;
  onArchive?: (emailId: string) => void;
  onDelete?: (emailId: string) => void;
  onFolderChange?: (folderId: string) => void;
}

export default function MailPage({
  emails: propEmails,
  folders: propFolders,
  labels: propLabels,
  onCompose,
  onReply,
  onArchive,
  onDelete,
  onFolderChange
}: MailPageProps) {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  
  // New sidebar states
  const [isMailConnected, setIsMailConnected] = useState(false);
  const [leftTopPanel, setLeftTopPanel] = useState<'projects' | 'mail-folders'>('projects');
  const [topPanelHeight, setTopPanelHeight] = useState(50);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [selectedNode, setSelectedNode] = useState<PATreeNode | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  
  // Filter state
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['ongoing']);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Resize states
  const [foldersWidth, setFoldersWidth] = useState(176);
  const [listWidth, setListWidth] = useState(288);
  const [replyHeight, setReplyHeight] = useState(120);
  const [isDraggingFoldersWidth, setIsDraggingFoldersWidth] = useState(false);
  const [isDraggingListWidth, setIsDraggingListWidth] = useState(false);
  const [isDraggingReplyHeight, setIsDraggingReplyHeight] = useState(false);
  
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(50);
  const dragStartX = useRef(0);
  const dragStartFoldersWidth = useRef(176);
  const dragStartListWidth = useRef(288);
  const dragStartReplyY = useRef(0);
  const dragStartReplyHeight = useRef(120);

  const folders = propFolders || mockMailFolders;
  const labels = propLabels || mockMailLabels;
  const emails = propEmails || mockEmails;

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  // Handlers
  const handleFolderClick = (folderId: string) => {
    setActiveFolder(folderId);
    onFolderChange?.(folderId);
  };

  const handleEmailClick = (emailId: string) => {
    setSelectedEmailId(emailId);
  };

  const handleSendReply = () => {
    if (replyMessage.trim() && selectedEmail) {
      onReply?.(selectedEmail.id, replyMessage);
      setReplyMessage('');
    }
  };

  const handleArchive = () => {
    if (selectedEmail) {
      onArchive?.(selectedEmail.id);
    }
  };

  const handleDelete = () => {
    if (selectedEmail) {
      onDelete?.(selectedEmail.id);
    }
  };

  const toggleSwapPanels = () => {
    setLeftTopPanel(prev => prev === 'projects' ? 'mail-folders' : 'projects');
  };

  const handleNodeSelect = (node: PATreeNode) => {
    setSelectedNode(node);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleYear = (groupId: string, year: number) => {
    const key = `${groupId}-${year}`;
    setExpandedYears(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleMailProjectClick = (projectId: string) => {
    setSelectedMailProjectId(projectId);
  };

  // Height drag handlers
  const handleHeightDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingHeight(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = topPanelHeight;
  };

  useEffect(() => {
    if (!isDraggingHeight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('mail-left-sidebar');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const deltaY = e.clientY - dragStartY.current;
      const deltaPercent = (deltaY / containerRect.height) * 100;
      const newHeight = Math.min(80, Math.max(20, dragStartHeight.current + deltaPercent));
      setTopPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDraggingHeight(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHeight]);

  // Width drag handlers
  const handleFoldersWidthDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingFoldersWidth(true);
    dragStartX.current = e.clientX;
    dragStartFoldersWidth.current = foldersWidth;
  };

  const handleListWidthDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingListWidth(true);
    dragStartX.current = e.clientX;
    dragStartListWidth.current = listWidth;
  };

  useEffect(() => {
    if (!isDraggingFoldersWidth && !isDraggingListWidth) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;
      if (isDraggingFoldersWidth) {
        const newWidth = Math.min(280, Math.max(140, dragStartFoldersWidth.current + deltaX));
        setFoldersWidth(newWidth);
        localStorage.setItem('mail-folders-width', String(newWidth));
      } else if (isDraggingListWidth) {
        const newWidth = Math.min(480, Math.max(220, dragStartListWidth.current + deltaX));
        setListWidth(newWidth);
        localStorage.setItem('mail-list-width', String(newWidth));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingFoldersWidth(false);
      setIsDraggingListWidth(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingFoldersWidth, isDraggingListWidth]);

  // Reply height drag handlers
  const handleReplyHeightDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingReplyHeight(true);
    dragStartReplyY.current = e.clientY;
    dragStartReplyHeight.current = replyHeight;
  };

  useEffect(() => {
    if (!isDraggingReplyHeight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartReplyY.current;
      const newHeight = Math.min(320, Math.max(80, dragStartReplyHeight.current - deltaY));
      setReplyHeight(newHeight);
      localStorage.setItem('mail-reply-height', String(newHeight));
    };

    const handleMouseUp = () => {
      setIsDraggingReplyHeight(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingReplyHeight]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedFoldersWidth = localStorage.getItem('mail-folders-width');
    const storedListWidth = localStorage.getItem('mail-list-width');
    const storedReplyHeight = localStorage.getItem('mail-reply-height');

    if (storedFoldersWidth) {
      const width = parseInt(storedFoldersWidth, 10);
      if (width >= 140 && width <= 280) setFoldersWidth(width);
    }
    if (storedListWidth) {
      const width = parseInt(storedListWidth, 10);
      if (width >= 220 && width <= 480) setListWidth(width);
    }
    if (storedReplyHeight) {
      const height = parseInt(storedReplyHeight, 10);
      if (height >= 80 && height <= 320) setReplyHeight(height);
    }
  }, []);

  const getTagStyles = (tag: string) => {
    const styles: Record<string, string> = {
      project: 'bg-primary/10 text-primary',
      approval: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      team: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      billing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      report: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return styles[tag] || 'bg-secondary text-secondary-foreground';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadgeVariant = (status: ProjectStatus): 'default' | 'secondary' | 'outline' => {
    if (status === 'Ongoing') return 'default';
    if (status === 'Completed') return 'secondary';
    return 'outline';
  };

  // Filter logic
  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.length === 1 ? prev
        : prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filterLabel = selectedStatuses.length === 1
    ? `${selectedStatuses[0].charAt(0).toUpperCase() + selectedStatuses[0].slice(1)} Projects`
    : 'Projects';

  // Filter PAProjectTree groups by status and search
  const filteredGroups = mockProjectGroups.map(group => ({
    ...group,
    projects: group.projects.filter(p => {
      const matchesStatus = selectedStatuses.includes(p.status);
      const matchesSearch = projectSearch === '' || p.name.toLowerCase().includes(projectSearch.toLowerCase()) || p.projectNumber?.toLowerCase().includes(projectSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    })
  })).filter(group => group.projects.length > 0);

  // Show status badge only when more than one status is selected
  const showStatusBadge = selectedStatuses.length > 1;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!filterOpen) return;

    const handleClickOutside = () => {
      setFilterOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [filterOpen]);

  // Render sub-panels
  const renderProjectTree = () => (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2 space-y-2">
        {/* Filter Header */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen(prev => !prev);
            }}
            className="flex items-center gap-2 px-2 py-1.5 w-full hover:bg-accent/50 rounded"
          >
            <span className="font-semibold text-sm flex-1 text-left">{filterLabel}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          {filterOpen && (
            <div className="absolute top-full left-0 z-50 bg-popover border border-border rounded-md shadow-md py-1 min-w-[160px] mt-1"
              onClick={(e) => e.stopPropagation()}
            >
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

        {/* Search Box */}
        <div className="px-2 pb-1">
          <div className="flex items-center gap-2 border border-border rounded-md px-2 py-1">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="text-xs bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <PAProjectTree
        groups={filteredGroups}
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
        showStatusBadge={showStatusBadge}
        renderSubItems={(node) => {
          // Only show mail labels for project nodes
          if (node.type !== 'project') return null;
          const labels = mockProjectLabels[node.id] ?? ['Inbox'];
          return (
            <div className="flex flex-col gap-0.5">
              {labels.map(label => (
                <button
                  key={label}
                  className="text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 px-2 py-0.5 rounded-sm text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          );
        }}
        className="flex-1 overflow-y-auto px-2"
      />
    </div>
  );

  const renderMailFolders = () => (
    <div className="flex flex-col h-full p-3 gap-3">
      {!isMailConnected ? (
        /* Not Connected State - Show only connect button */
        <div className="flex flex-col h-full items-center justify-center">
          <button
            onClick={() => setIsMailConnected(true)}
            className="w-full h-9 px-4 border border-border rounded-lg flex items-center justify-center gap-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Mail className="w-4 h-4" />
            Connect Mailbox
          </button>
        </div>
      ) : (
        /* Connected State - Show compose, folders, and connection info */
        <>
          {/* Compose Button */}
          <button
            onClick={onCompose}
            className="w-full h-9 rounded-lg flex items-center justify-center gap-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            New Email
          </button>

          {/* Folders List */}
          <nav className="flex flex-col gap-1 flex-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder.id)}
                  className={`w-full h-8 rounded-lg flex items-center gap-2 px-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-l-primary'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span className="flex-1 text-left">{folder.name}</span>
                  {folder.count && folder.count > 0 && (
                    <span className="text-xs font-medium">{folder.count}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Connected Account */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-1 truncate">alex@gmail.com</span>
              <button
                onClick={() => setIsMailConnected(false)}
                className="w-5 h-5 rounded flex items-center justify-center hover:bg-accent transition-colors"
                title="Disconnect"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* PANEL 1 - Smart Sidebar with Projects + Mail */}
      <div className="relative flex">
        <div id="mail-left-sidebar" style={{ width: `${foldersWidth}px` }} className="border-r border-border bg-sidebar flex flex-col">
          {/* Top Sub-Panel */}
          <div style={{ height: `${topPanelHeight}%` }} className="overflow-hidden flex flex-col">
            {leftTopPanel === 'projects' ? renderProjectTree() : renderMailFolders()}
          </div>

          {/* Horizontal Drag Handle */}
          <div
            onMouseDown={handleHeightDragStart}
            className="h-1.5 w-full bg-border hover:bg-primary/40 cursor-row-resize relative flex items-center justify-center transition-colors"
          >
            {/* Swap Button */}
            <button
              onClick={toggleSwapPanels}
              className="absolute bg-background border border-border rounded-full w-6 h-6 flex items-center justify-center hover:bg-accent transition-colors z-10"
              title="Swap panels"
            >
              <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          {/* Bottom Sub-Panel */}
          <div style={{ height: `${100 - topPanelHeight}%` }} className="overflow-hidden flex flex-col">
            {leftTopPanel === 'mail-folders' ? renderProjectTree() : renderMailFolders()}
          </div>
        </div>

        {/* Folders Width Resize Handle */}
        <div
          onMouseDown={handleFoldersWidthDragStart}
          className="w-1 bg-border hover:bg-primary/40 cursor-col-resize h-full transition-colors"
        />
      </div>

      {/* PANEL 2 - Email List */}
      <div className="relative flex">
        <div style={{ width: `${listWidth}px` }} className="border-r border-border bg-card flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <button
                  key={email.id}
                  onClick={() => handleEmailClick(email.id)}
                  className={`w-full p-4 border-b border-border text-left transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-l-2 border-l-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  {/* Sender and Time Row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {getInitials(email.sender)}
                      </div>
                      <span className={`text-sm truncate ${email.unread ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                        {email.sender}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{email.time}</span>
                  </div>

                  {/* Subject */}
                  <div className={`text-sm mb-1 truncate ${email.unread ? 'font-medium text-foreground' : 'text-foreground'}`}>
                    {email.subject}
                  </div>

                  {/* Preview */}
                  <div className="text-xs text-muted-foreground truncate mb-2">
                    {email.preview}
                  </div>

                  {/* Bottom Row - Unread dot, Tags, Attachment */}
                  <div className="flex items-center gap-2">
                    {email.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    {email.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full ${getTagStyles(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {email.hasAttachments && (
                      <Paperclip className="w-3 h-3 text-muted-foreground ml-auto flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* List Width Resize Handle */}
        <div
          onMouseDown={handleListWidthDragStart}
          className="w-1 bg-border hover:bg-primary/40 cursor-col-resize h-full transition-colors"
        />
      </div>

      {/* PANEL 3 - Email Content */}
      <div className="flex-1 bg-background flex flex-col">
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-border px-6 flex items-center gap-2">
              <button className="h-9 px-4 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                <Reply className="w-4 h-4" />
                Reply
              </button>
              <button className="h-9 px-4 border border-border rounded-lg flex items-center gap-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                <Forward className="w-4 h-4" />
                Forward
              </button>
              <div className="flex-1" />
              <button
                onClick={handleArchive}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Subject */}
              <h2 className="text-2xl font-semibold text-foreground mb-6">{selectedEmail.subject}</h2>

              {/* Sender Info */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getInitials(selectedEmail.sender)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-foreground">{selectedEmail.sender}</span>
                    <span className="text-sm text-muted-foreground">&lt;{selectedEmail.senderEmail}&gt;</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    to me
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{selectedEmail.time}</span>
              </div>

              {/* Email Body Content */}
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-6">
                {selectedEmail.body}
              </div>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Attachments ({selectedEmail.attachments.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {attachment.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {attachment.type} • {attachment.size}
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reply Height Drag Handle */}
            <div
              onMouseDown={handleReplyHeightDragStart}
              className="h-1.5 w-full bg-border hover:bg-primary/40 cursor-row-resize transition-colors"
            />

            {/* Reply Box */}
            <div style={{ height: `${replyHeight}px`, flexShrink: 0 }} className="border-t border-border p-6">
              <div className="h-full rounded-xl border border-border focus-within:border-primary transition-colors bg-card flex flex-col">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 w-full p-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
                />
                <div className="flex items-center justify-between px-4 pb-4">
                  <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select an email to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}