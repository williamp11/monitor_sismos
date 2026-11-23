import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NearbyQuakeCard from './NearbyQuakeCard';
import type { EarthquakeWithDistance } from '../types/DashboardTypes';

interface NearbyQuakeListProps {
    quakes: EarthquakeWithDistance[];
    onSelect: (id: string) => void;
}

export default function NearbyQuakeList({ quakes, onSelect }: NearbyQuakeListProps) {
    return (
        <Stack sx={{ gap: 1 }}>
            {quakes.map((quake) => (
                <NearbyQuakeCard key={quake.id} quake={quake} onSelect={onSelect} />
            ))}
            <Typography variant="caption" color="text.secondary">
                La tabla de registros detallados se muestra solo en la versión de escritorio.
            </Typography>
        </Stack>
    );
}