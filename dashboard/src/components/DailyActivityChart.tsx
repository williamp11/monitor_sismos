import { LineChart } from '@mui/x-charts/LineChart';

interface DailyActivityChartProps {
    labels: string[];
    values: number[];
}

export default function DailyActivityChart({ labels, values }: DailyActivityChartProps) {
    return (
        <LineChart
            height={260}
            series={[{ data: values, label: 'Sismos por día', color: '#F27A1A', curve: 'linear' }]}
            xAxis={[{ scaleType: 'point', data: labels }]}
            hideLegend />
    );
}