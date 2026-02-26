/**
 * PEOPLE CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `PeoplePage` component and supply it with data.
 */
import { useState, useEffect } from 'react';
import PeoplePage from '../../app/modules/people/PeoplePage';
import { getEmployees } from '../services/people';
import type { User } from '../../app/modules/people/PeoplePage';

export default function PeopleConnected() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getEmployees().then(data => {
            setUsers(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <PeoplePage
            users={users}
            isLoading={isLoading}
            onAddUser={() => console.log('Add User clicked')}
            onEditUser={(id) => console.log('Edit User clicked', id)}
            onImport={() => console.log('Import clicked')}
            onExport={() => console.log('Export clicked')}
            onSettingsClick={() => console.log('Settings clicked')}
        />
    );
}
