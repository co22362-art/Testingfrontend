// Types
export interface VideoItem {
  id: string;
  title: string;
  provider: string;
  url: string;
}

export interface ModuleItem {
  id: string;
  name: string;
  videos: VideoItem[];
}

export interface SoftwareItem {
  id: string;
  name: string;
  modules: ModuleItem[];
}

// Mock Data - Tutorial Tree (Software → Module → Video hierarchy)
export const mockTutorials: SoftwareItem[] = [
  {
    id: 'pa',
    name: 'ProjectAssist',
    modules: [
      {
        id: 'people',
        name: 'People',
        videos: [
          {
            id: 'people-getting-started',
            title: 'Getting Started with People',
            provider: 'googledrive',
            url: 'https://drive.google.com/file/d/example1/preview'
          },
          {
            id: 'people-managing-records',
            title: 'Managing Employee Records',
            provider: 'googledrive',
            url: 'https://drive.google.com/file/d/example2/preview'
          }
        ]
      },
      {
        id: 'timesheets',
        name: 'Time Sheets',
        videos: [
          {
            id: 'timesheets-submit',
            title: 'How to Submit a Timesheet',
            provider: 'synthesia',
            url: 'https://share.synthesia.io/embeds/videos/example3'
          }
        ]
      }
    ]
  },
  {
    id: 'cad',
    name: 'CAD Manager',
    modules: [
      {
        id: 'drawings',
        name: 'Drawings',
        videos: [
          {
            id: 'drawings-upload',
            title: 'Uploading CAD Files',
            provider: 'googledrive',
            url: 'https://drive.google.com/file/d/example4/preview'
          }
        ]
      }
    ]
  }
];
