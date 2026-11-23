import Grid from '@mui/material/Grid';
import KpiCard, { type KpiCardProps } from './KpiCard';

export interface KpiItem extends KpiCardProps {
    id: string;
    desktopOnly?: boolean;
}

interface KpiGridProps {
    items: KpiItem[];
}

export default function KpiGrid({ items }: KpiGridProps) {
    return (
        <Grid container spacing={2}>
            {items.map((item) => (
                <Grid
                    key={item.id}
                    size={{ xs: 6, md: 'grow' }}
                    sx={{ display: { xs: item.desktopOnly ? 'none' : 'block', md: 'block' } }}>
                    <KpiCard
                        title={item.title}
                        value={item.value}
                        helper={item.helper}
                        icon={item.icon}
                        accent={item.accent} />
                </Grid>
            ))}
        </Grid>
    );
}