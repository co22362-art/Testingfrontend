// Types
export interface ProjectGroup {
  id: string;
  name: string;
  active_users: number;
  badge_count: number;
  initials: string;
}

export interface GroupSettings {
  yearwise_categorise: boolean;
  allow_project_number_edit: boolean;
  classify_projects: boolean;
  initiate_project_creation_form: boolean;
  confidential_directory: boolean;
  project_number_format: string;
  allow_mail_settings: boolean;
  allow_quality_settings: boolean;
  allow_drawing_settings: boolean;
  quality_forms_path: string;
}

// Mock Data - Project Groups
export const mockProjectGroups: ProjectGroup[] = [
  { id: '1', name: 'EGIS Infrastructure', active_users: 8, badge_count: 2, initials: 'EI' },
  { id: '2', name: 'EGIS Buildings', active_users: 5, badge_count: 0, initials: 'EB' },
  { id: '3', name: 'EGIS Environment', active_users: 3, badge_count: 1, initials: 'EE' },
];

// Mock Data - Default Group Settings
export const mockDefaultSettings: GroupSettings = {
  yearwise_categorise: true,
  allow_project_number_edit: false,
  classify_projects: true,
  initiate_project_creation_form: true,
  confidential_directory: true,
  project_number_format: 'YY-XXZZ',
  allow_mail_settings: true,
  allow_quality_settings: true,
  allow_drawing_settings: true,
  quality_forms_path: 'C:\\\\Fresh Start\\\\New folder (3)\\\\Working',
};
