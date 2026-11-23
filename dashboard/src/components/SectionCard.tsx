import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface SectionCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function SectionCard({ title, subtitle, children }: SectionCardProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div>
                    <Typography variant="subtitle1" component="h2">{title}</Typography>
                    {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}