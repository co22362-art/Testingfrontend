/**
 * Single source of truth for project tree mock data
 * Used across ProjectsPage, MailPage, and any future pages.
 */

import { PAProjectGroup } from '../components/ui/PAProjectTree';

// Extended PAProject type with year field
export interface PAProject {
  id: string;
  name: string;
  projectNumber?: string;
  year: number; // 0 means no year grouping
  status: 'ongoing' | 'completed' | 'archived';
  isConfidential: boolean;
}

// Extended PAProjectGroup type with year-aware projects
export interface PAProjectGroupExtended {
  id: string;
  name: string;
  hasConfidential: boolean;
  projects: PAProject[];
}

export const mockProjectGroups: PAProjectGroupExtended[] = [
  {
    id: 'g1',
    name: 'IND PROJECTS',
    hasConfidential: true,
    projects: [
      { id: 'p1', name: 'Structural Analysis Phase 1', projectNumber: 'IND-001', year: 2025, status: 'ongoing', isConfidential: false },
      { id: 'p2', name: 'Foundation Design', projectNumber: 'IND-002', year: 2025, status: 'completed', isConfidential: false },
      { id: 'p3', name: 'Client A Confidential Review', projectNumber: 'IND-003', year: 2025, status: 'ongoing', isConfidential: true },
      { id: 'p4', name: 'Bridge Assessment', projectNumber: 'IND-098', year: 2024, status: 'archived', isConfidential: false },
    ]
  },
  {
    id: 'g2',
    name: '2026Testing',
    hasConfidential: false,
    projects: [
      { id: 'p5', name: 'Test Project Alpha', projectNumber: 'TP-001', year: 2026, status: 'ongoing', isConfidential: false },
      { id: 'p6', name: 'Test Project Beta', projectNumber: 'TP-002', year: 2026, status: 'archived', isConfidential: false },
    ]
  },
  {
    id: 'g3',
    name: 'AMAN TESTING NEW',
    hasConfidential: true,
    projects: [
      { id: 'p7', name: 'Sample Working Project', projectNumber: 'AT-001', year: 2025, status: 'ongoing', isConfidential: false },
      { id: 'p8', name: 'Confidential Tender', projectNumber: 'AT-002', year: 2025, status: 'ongoing', isConfidential: true },
    ]
  },
  {
    id: 'g4',
    name: 'IND BUILDINGS',
    hasConfidential: true,
    projects: [
      { id: 'p9', name: 'Metro Tower Foundation', projectNumber: 'BLD-011', year: 2025, status: 'ongoing', isConfidential: false },
      { id: 'p10', name: 'Airport Terminal', projectNumber: 'BLD-009', year: 2024, status: 'completed', isConfidential: false },
    ]
  }
];
