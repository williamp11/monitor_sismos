import Button from '@mui/material/Button';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface NearMeButtonProps {
    active: boolean;
    onClick: () => void;
}

export default function NearMeButton({ active, onClick }: NearMeButtonProps) {
    return (
        <Button
            fullWidth
            size="large"
            color="secondary"
            variant={active ? 'outlined' : 'contained'}
            startIcon={<MyLocationIcon />}
            onClick={onClick}
            sx={{ display: { xs: 'flex', md: 'none' }, py: 1.5, fontWeight: 700 }}>
            {active ? 'Ver todos los sismos' : 'Ver sismos cerca de mí'}
        </Button>
    );
}