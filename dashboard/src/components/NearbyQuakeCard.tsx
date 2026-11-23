import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { magColor } from '../theme/theme';
import type { EarthquakeWithDistance } from '../types/DashboardTypes';
import { fmtKm, formatDateTime } from '../utils/earthquakeStats';

interface NearbyQuakeCardProps {
    quake: EarthquakeWithDistance;
    onSelect: (id: string) => void;
}

export default function NearbyQuakeCard({ quake, onSelect }: NearbyQuakeCardProps) {
    return (
        <Card>
            <CardActionArea onClick={() => onSelect(quake.id)} sx={{ p: 1.5 }}>
                <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                    <Box sx={{ minWidth: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: magColor(quake.mag), color: 'white', fontWeight: 700 }}>
                        {quake.mag?.toFixed(1)}
                    </Box>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="subtitle2" noWrap>{quake.place}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDateTime(quake.time)} · Prof. {quake.depth?.toFixed(0)} km
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{fmtKm(quake.distanceKm)}</Typography>
                </Stack>
            </CardActionArea>
        </Card>
    );
}