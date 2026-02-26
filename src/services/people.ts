/**
 * PEOPLE SERVICE
 * Connects to pa_3012_people (port 3012) via Vite proxy.
 */

export interface Employee {
    id: string;
    employee_code: string;
    name: string;
    email: string;
    role_title: string;
    department: string;
    classification: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface EmployeesResponse {
    success?: boolean;
    data: Employee[];
    count: number;
}

/**
 * Fetch all employees for the current user's company.
 * Auth cookie is sent automatically (credentials: include).
 */
export async function getEmployees(): Promise<Employee[]> {
    try {
        const res = await fetch('/api/employees', {
            credentials: 'include',
        });
        if (!res.ok) return [];
        const json = await res.json();
        // People API returns { employees: [...], total, page, limit }
        return Array.isArray(json) ? json : (json.employees ?? json.data ?? []);
    } catch {
        return [];
    }
}
