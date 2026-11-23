import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { magColor } from '../theme/theme';
import type { EarthquakeWithDistance } from '../types/DashboardTypes';
import { fmtKm, formatDateTime } from '../utils/earthquakeStats';

interface EarthquakeDetailCardProps {
    quake: EarthquakeWithDistance | null;
}

export default function EarthquakeDetailCard({ quake }: EarthquakeDetailCardProps) {

    if (!quake) {
        return <Typography variant="body2" color="text.secondary">Seleccione un sismo en el mapa.</Typography>;
    }

    return (
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Box sx={{ minWidth: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: magColor(quake.mag), color: 'white', fontWeight: 700 }}>
                {quake.mag?.toFixed(1)}
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap>{quake.place}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatDateTime(quake.time)} · Prof. {quake.depth?.toFixed(0)} km · A {fmtKm(quake.distanceKm)}
                </Typography>
            </Box>
            <Chip
                size="small"
                label={quake.status === 'reviewed' ? 'Revisado' : 'Automático'}
                color={quake.status === 'reviewed' ? 'primary' : 'default'} />
        </Stack>
    );
}