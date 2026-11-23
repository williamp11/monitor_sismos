import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export interface KpiCardProps {
    title: string;
    value: string;
    helper?: string;
    icon: ReactNode;
    accent?: boolean;
}

export default function KpiCard({ title, value, helper, icon, accent = false }: KpiCardProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>
                <Box
                    sx={{
                        p: 1, borderRadius: 2, display: 'flex', alignSelf: 'flex-start',
                        bgcolor: accent ? 'secondary.main' : '#FDEBDD',
                        color: accent ? 'white' : 'secondary.main',
                    }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>{value}</Typography>
                    {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
                </Box>
            </CardContent>
        </Card>
    );
}