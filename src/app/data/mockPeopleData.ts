// Types
export interface User {
  id: number;
  empCode: string;
  name: string;
  email: string;
  role: string;
  department: string;
  classification: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Mock Data - Users/Employees
export const mockUsers: User[] = [
  { id: 1, empCode: 'E002', name: 'Aditya EGIS', email: 'scipl_pc_001@outlook.com', role: 'Testing', department: 'Quality Testing', classification: 'QLT', status: 'ACTIVE' },
  { id: 2, empCode: 'E001', name: 'Aman EGIS', email: 'aman.spannovation@gmail.com', role: 'Director', department: 'Quality Testing', classification: 'Manager', status: 'ACTIVE' },
  { id: 3, empCode: 'INT-006', name: 'Aryan Rawat', email: 'aryanrawat4044@gmail.com', role: 'Programming', department: 'CSE', classification: 'ENG', status: 'ACTIVE' },
  { id: 4, empCode: 'INT-001', name: 'Jaspreet Kaur', email: 'jaspreet4143@gmail.com', role: 'Drafting', department: 'Drafting', classification: 'Draftsman', status: 'ACTIVE' },
  { id: 5, empCode: 'INT-002', name: 'Jaspreet Kaur', email: 'jaspreetkaur786@gmail.com', role: 'Drafting', department: 'Drafting', classification: 'Draftsman', status: 'ACTIVE' },
  { id: 6, empCode: 'INT-003', name: 'Nancy _', email: 'nancygujar012@gmail.com', role: 'Drafting', department: 'Drafting', classification: 'Draftsman', status: 'ACTIVE' },
  { id: 7, empCode: 'M001', name: 'Preeti Garg', email: 'mgmt.spannovation@gmail.com', role: 'Director', department: 'ENG', classification: 'Manager', status: 'ACTIVE' },
  { id: 8, empCode: 'INT-005', name: 'Shaurya Katna', email: 'shauryakatna7@gmail.com', role: 'Programming', department: 'CSE', classification: 'ENG', status: 'ACTIVE' },
  { id: 9, empCode: 'E003', name: 'Shivani Shukla', email: 'sshukla.structure@gmail.com', role: 'Testing', department: 'Quality Testing', classification: 'QLT', status: 'ACTIVE' },
  { id: 10, empCode: 'Try001', name: 'try', email: 'asing1@egscif.in', role: '—', department: '—', classification: '—', status: 'INACTIVE' },
];
