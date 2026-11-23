import { PieChart } from '@mui/x-charts/PieChart';

interface ReviewStatusChartProps {
    reviewed: number;
    automatic: number;
}

export default function ReviewStatusChart({ reviewed, automatic }: ReviewStatusChartProps) {
    return (
        <PieChart
            height={220}
            series={[{
                innerRadius: 55,
                outerRadius: 90,
                paddingAngle: 2,
                cornerRadius: 4,
                data: [
                    { id: 0, value: reviewed, label: 'Revisados', color: '#0F2A4A' },
                    { id: 1, value: automatic, label: 'Automáticos', color: '#F27A1A' },
                ],
            }]} />
    );
}