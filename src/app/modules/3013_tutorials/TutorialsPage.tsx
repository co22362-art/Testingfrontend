import { useState, useEffect, useRef } from 'react';
import PAAppLayout from '../../components/PAAppLayout';
import PASidebarHeader from '../../components/ui/PASidebarHeader';
import { 
  Play, 
  ChevronRight, 
  ChevronDown, 
  PlayCircle,
  AlertCircle,
  Video
} from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import PAButton from '../../components/ui/PAButton';
import { 
  mockTutorials,
  type VideoItem,
  type ModuleItem,
  type SoftwareItem
} from '@/app/data/mockTutorialData';

const STORAGE_KEY = 'videoSidebarWidth';
const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 220;
const MAX_WIDTH = 600;

export default function TutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<{
    video: VideoItem;
    software: string;
    module: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSoftware, setExpandedSoftware] = useState<Set<string>>(new Set(['pa']));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['people']));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
  });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;

    // Disable pointer events on iframe
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = 'none';
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartWidth.current + delta));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());

      // Re-enable pointer events on iframe
      if (iframeRef.current) {
        iframeRef.current.style.pointerEvents = 'auto';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, sidebarWidth]);

  const toggleSoftware = (softwareId: string) => {
    setExpandedSoftware(prev => {
      const newSet = new Set(prev);
      if (newSet.has(softwareId)) {
        newSet.delete(softwareId);
      } else {
        newSet.add(softwareId);
      }
      return newSet;
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleVideoSelect = (video: VideoItem, software: string, module: string) => {
    setSelectedVideo({ video, software, module });
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Simulate retry
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Filter tree based on search query
  const filteredTutorials = searchQuery
    ? mockTutorials
        .map((software) => {
          const filteredModules = software.modules
            .map((module) => {
              const filteredVideos = module.videos.filter((video) =>
                video.title.toLowerCase().includes(searchQuery.toLowerCase())
              );
              return filteredVideos.length > 0
                ? { ...module, videos: filteredVideos }
                : null;
            })
            .filter((module): module is ModuleItem => module !== null);

          return filteredModules.length > 0
            ? { ...software, modules: filteredModules }
            : null;
        })
        .filter((software): software is SoftwareItem => software !== null)
    : mockTutorials;

  // Auto-expand all nodes when search is active
  const isSearchActive = searchQuery.trim().length > 0;
  const displayExpandedSoftware = isSearchActive
    ? new Set(filteredTutorials.map((s) => s.id))
    : expandedSoftware;
  const displayExpandedModules = isSearchActive
    ? new Set(filteredTutorials.flatMap((s) => s.modules.map((m) => m.id)))
    : expandedModules;

  return (
    <PAAppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Video Tree Sidebar */}
        <div
          style={{ width: `${sidebarWidth}px` }}
          className="flex flex-col border-r border-border bg-card relative"
        >
          {/* Header */}
          <PASidebarHeader
            title="Tutorials"
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Tree Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Error Loading Videos
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <PAButton onClick={handleRetry} size="sm">
                  Retry
                </PAButton>
              </div>
            ) : mockTutorials.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Video className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No videos available</p>
              </div>
            ) : filteredTutorials.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Video className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No videos found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredTutorials.map((software) => (
                  <div key={software.id} className="mb-1">
                    {/* SOFTWARE NODE */}
                    <button
                      onClick={() => toggleSoftware(software.id)}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-accent transition-colors text-left"
                    >
                      {displayExpandedSoftware.has(software.id) ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm font-bold text-primary">{software.name}</span>
                    </button>

                    {/* MODULES */}
                    {displayExpandedSoftware.has(software.id) && (
                      <div style={{ marginLeft: '12px' }}>
                        {software.modules.map((module) => (
                          <div key={module.id} className="mb-1">
                            {/* MODULE NODE */}
                            <button
                              onClick={() => toggleModule(module.id)}
                              className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-accent transition-colors text-left"
                            >
                              {displayExpandedModules.has(module.id) ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-muted-foreground">
                                {module.name}
                              </span>
                            </button>

                            {/* VIDEOS */}
                            {displayExpandedModules.has(module.id) && (
                              <div style={{ marginLeft: '24px' }}>
                                {module.videos.map((video) => {
                                  const isActive =
                                    selectedVideo?.video.id === video.id;
                                  return (
                                    <button
                                      key={video.id}
                                      onClick={() =>
                                        handleVideoSelect(
                                          video,
                                          software.name,
                                          module.name
                                        )
                                      }
                                      className={`w-full flex items-center gap-2 px-2 py-2 rounded transition-colors text-left relative ${
                                        isActive
                                          ? 'text-primary bg-accent border-l-2 border-l-primary'
                                          : 'text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Play
                                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                                          isActive ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                      />
                                      <span className="text-sm">{video.title}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-border hover:bg-primary/40 transition-colors z-10"
          />
        </div>

        {/* RIGHT PANEL - Video Player */}
        <div className={`flex-1 flex flex-col ${selectedVideo ? 'bg-black' : 'bg-background'}`}>
          {!selectedVideo ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-base text-muted-foreground">
                  Select a tutorial to start watching
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Video Player */}
              <div className="flex-1 relative">
                <iframe
                  ref={iframeRef}
                  src={selectedVideo.video.url}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.video.title}
                />
              </div>

              {/* Info Bar */}
              <div className="bg-card border-t border-border px-6 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-medium">
                    {selectedVideo.software}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedVideo.module}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {selectedVideo.video.title}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PAAppLayout>
  );
}