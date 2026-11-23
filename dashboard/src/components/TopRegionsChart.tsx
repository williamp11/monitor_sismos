import { BarChart } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';

interface TopRegionsChartProps {
    regions: string[];
    counts: number[];
    onRegionSelect: (region: string) => void;
}

export default function TopRegionsChart({ regions, counts, onRegionSelect }: TopRegionsChartProps) {
    return (
        <>
            <BarChart
                height={260}
                layout="horizontal"
                yAxis={[{ scaleType: 'band', data: regions, width: 90 }]}
                series={[{ data: counts, label: 'Sismos', color: '#0F2A4A' }]}
                onItemClick={(_event, item) => onRegionSelect(regions[item.dataIndex])}
                hideLegend />
            <Typography variant="caption" color="text.secondary">
                Haga clic en una barra para filtrar por esa región.
            </Typography>
        </>
    );
}