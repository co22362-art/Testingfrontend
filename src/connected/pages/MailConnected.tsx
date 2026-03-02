/**
 * MAIL CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `MailPage` component inside PAAppLayout
 * since MailPage doesn't include its own layout shell.
 * TODO: Wire to a real mail/notifications API when available.
 */
import PAAppLayout from '../../app/components/PAAppLayout';
import MailPage from '../../app/modules/3003_mail/MailPage';

export default function MailConnected() {
    return (
        <PAAppLayout>
            <MailPage />
        </PAAppLayout>
    );
}
