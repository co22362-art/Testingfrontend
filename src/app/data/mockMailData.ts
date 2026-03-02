import { 
  Inbox, 
  Send, 
  FileText, 
  Star, 
  Archive, 
  Trash2 
} from 'lucide-react';

// Types
export interface MailLabel {
  id: string;
  name: string;
  color: string;
}

export interface MailEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  tags: string[];
  hasAttachments: boolean;
  body: string;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
}

export interface MailFolder {
  id: string;
  name: string;
  icon: React.ElementType;
  count?: number;
}

// Mock Data - Project Labels (projectId -> mail label names)
export const mockProjectLabels: Record<string, string[]> = {
  'p1': ['Inbox', 'Sent', 'Follow Up'],
  'p2': ['Inbox', 'Drafts'],
  'p3': ['Inbox'],
  'p4': ['Inbox', 'Sent'],
  'p5': ['Inbox'],
};

// Mock Data - Mail Folders
export const mockMailFolders: MailFolder[] = [
  { id: 'inbox', name: 'Inbox', icon: Inbox, count: 4 },
  { id: 'sent', name: 'Sent', icon: Send },
  { id: 'drafts', name: 'Drafts', icon: FileText, count: 2 },
  { id: 'starred', name: 'Starred', icon: Star },
  { id: 'archive', name: 'Archive', icon: Archive },
  { id: 'trash', name: 'Trash', icon: Trash2 }
];

// Mock Data - Mail Labels/Tags
export const mockMailLabels: MailLabel[] = [
  { id: 'project', name: 'Project', color: 'primary' },
  { id: 'approval', name: 'Approval', color: 'green' },
  { id: 'team', name: 'Team', color: 'purple' },
  { id: 'billing', name: 'Billing', color: 'amber' },
  { id: 'report', name: 'Report', color: 'blue' }
];

// Mock Data - Emails
export const mockEmails: MailEmail[] = [
  {
    id: '1',
    sender: 'Alex Rodriguez',
    senderEmail: 'alex.rodriguez@example.com',
    subject: 'Project Timeline Update - Phase 2',
    preview: 'Hi team, I wanted to share the updated timeline for Phase 2 of the project...',
    time: '10:30 AM',
    unread: true,
    tags: ['project'],
    hasAttachments: true,
    body: `Hi team,

I wanted to share the updated timeline for Phase 2 of the project. After reviewing the dependencies and resource allocation with the team, we've made some adjustments to ensure we can deliver quality work on schedule.

Key Updates:
• Design review moved to next Wednesday
• Development sprint extended by 2 days
• QA phase starts March 15th

Please review the attached timeline document and let me know if you have any concerns or questions. We'll discuss this in detail during tomorrow's standup.

Thanks,
Alex`,
    attachments: [
      { name: 'Phase2_Timeline.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Resource_Allocation.xlsx', size: '1.1 MB', type: 'Excel' }
    ]
  },
  {
    id: '2',
    sender: 'Sarah Chen',
    senderEmail: 'sarah.chen@example.com',
    subject: 'Budget Approval Required',
    preview: 'The Q2 budget proposal is ready for your review and approval...',
    time: '9:15 AM',
    unread: true,
    tags: ['approval', 'billing'],
    hasAttachments: false,
    body: `Hi,

The Q2 budget proposal is ready for your review and approval. I've included a detailed breakdown of all projected expenses and expected ROI for each initiative.

Please review at your earliest convenience as we need approval by end of week to proceed with vendor negotiations.

Best regards,
Sarah`,
    attachments: []
  },
  {
    id: '3',
    sender: 'Michael Park',
    senderEmail: 'michael.park@example.com',
    subject: 'Team Meeting Notes - Feb 27',
    preview: 'Attached are the notes from yesterday\'s team sync meeting...',
    time: 'Yesterday',
    unread: false,
    tags: ['team'],
    hasAttachments: true,
    body: `Hi everyone,

Attached are the notes from yesterday's team sync meeting. Key action items have been highlighted and assigned to respective owners.

Please review and update your tasks in the project tracker by EOD Friday.

Thanks,
Michael`,
    attachments: [
      { name: 'Meeting_Notes_Feb27.docx', size: '845 KB', type: 'Word' }
    ]
  },
  {
    id: '4',
    sender: 'Emma Thompson',
    senderEmail: 'emma.thompson@example.com',
    subject: 'Weekly Progress Report',
    preview: 'Please find the weekly progress report for all active projects...',
    time: 'Yesterday',
    unread: false,
    tags: ['report'],
    hasAttachments: true,
    body: `Hi team,

Please find the weekly progress report for all active projects. Overall we're tracking well against our goals with a few minor delays in the infrastructure workstream.

Let me know if you have any questions.

Best,
Emma`,
    attachments: [
      { name: 'Weekly_Report_W08.pdf', size: '3.2 MB', type: 'PDF' }
    ]
  },
  {
    id: '5',
    sender: 'David Kim',
    senderEmail: 'david.kim@example.com',
    subject: 'CAD Files Review Request',
    preview: 'Could you please review the latest CAD files for the structural design...',
    time: 'Feb 26',
    unread: false,
    tags: ['project'],
    hasAttachments: true,
    body: `Hi,

Could you please review the latest CAD files for the structural design? I've addressed all the feedback from the last review cycle.

Looking forward to your comments.

Thanks,
David`,
    attachments: [
      { name: 'Structural_Design_v3.dwg', size: '15.7 MB', type: 'CAD' }
    ]
  },
  {
    id: '6',
    sender: 'Lisa Anderson',
    senderEmail: 'lisa.anderson@example.com',
    subject: 'Invoice #2024-0156',
    preview: 'Please find attached invoice for the consulting services provided in February...',
    time: 'Feb 25',
    unread: false,
    tags: ['billing'],
    hasAttachments: true,
    body: `Hi,

Please find attached invoice for the consulting services provided in February. Payment is due within 30 days.

Thank you,
Lisa Anderson`,
    attachments: [
      { name: 'Invoice_2024-0156.pdf', size: '245 KB', type: 'PDF' }
    ]
  }
];
