/**
 * PEOPLE CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `PeoplePage` and supply it with REAL employee
 * data from /api/employees endpoint (pa_3012_people backend).
 */
import { useState, useEffect } from 'react';
import PeoplePage from '../../app/modules/3012_people/PeoplePage';
import { getEmployees } from '../services/people';
import type { User } from '../../app/data/mockPeopleData';

export default function PeopleConnected() {
    const [users, setUsers] = useState<User[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const data = await getEmployees();
            // Only set users if we got real data; otherwise leave undefined
            // so PeoplePage falls back to mock data (temporary until backend works)
            setUsers(data.length > 0 ? data : undefined);
            setIsLoading(false);
        })();
    }, []);

    return (
        <PeoplePage
            users={users}
            isLoading={isLoading}
        />
    );
}
