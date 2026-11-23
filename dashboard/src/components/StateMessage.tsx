import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface StateMessageProps {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function StateMessage({ message, actionLabel, onAction }: StateMessageProps) {
    return (
        <Alert
            severity="info"
            variant="outlined"
            action={actionLabel && onAction && <Button color="inherit" size="small" onClick={onAction}>{actionLabel}</Button>}>
            {message}
        </Alert>
    );
}