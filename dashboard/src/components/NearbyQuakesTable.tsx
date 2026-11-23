import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { EarthquakeWithDistance } from '../types/DashboardTypes';
import { formatDateTime } from '../utils/earthquakeStats';

interface NearbyQuakesTableProps {
    quakes: EarthquakeWithDistance[];
    onSelect: (id: string) => void;
}

export default function NearbyQuakesTable({ quakes, onSelect }: NearbyQuakesTableProps) {

    const columns: GridColDef<EarthquakeWithDistance>[] = [
        { field: 'distanceKm', headerName: 'Distancia (km)', width: 130, valueFormatter: (value: number) => Math.round(value) },
        { field: 'time', headerName: 'Fecha (hora local)', width: 160, valueFormatter: (value: string) => formatDateTime(value) },
        { field: 'place', headerName: 'Lugar', flex: 1, minWidth: 220 },
        { field: 'mag', headerName: 'Magnitud', width: 100 },
        { field: 'depth', headerName: 'Profundidad (km)', width: 140 },
        { field: 'magType', headerName: 'Tipo', width: 80 },
        { field: 'status', headerName: 'Estado', width: 110 },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={quakes}
                columns={columns}
                onRowClick={(params) => onSelect(String(params.id))}
                hideFooter
                disableRowSelectionOnClick
                density="compact" />
        </Box>
    );
}