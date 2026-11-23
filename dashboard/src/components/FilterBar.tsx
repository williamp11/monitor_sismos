import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import TuneIcon from '@mui/icons-material/Tune';
import SelectField from './SelectField';
import { DAY_OPTIONS, MAG_OPTIONS } from '../data/sampleData';
import type { Filters, RadiusKm } from '../types/DashboardTypes';

interface FilterBarProps {
    filters: Filters;
    regions: string[];
    onChange: (changes: Partial<Filters>) => void;
    onClear: () => void;
}

const RADII: RadiusKm[] = [100, 500, 1000];

export default function FilterBar({ filters, regions, onChange, onClear }: FilterBarProps) {

    // Estado local: en móvil el panel de filtros se abre o se cierra.
    const [open, setOpen] = useState<boolean>(false);

    const regionOptions = [{ value: 'Todas', label: 'Todas' }, ...regions.map((r) => ({ value: r, label: r }))];
    const daysLabel = DAY_OPTIONS.find((o) => o.value === String(filters.days))?.label;

    return (
        <Card sx={{ p: 2 }}>

            {/* Botón "Filtros": solo en móvil */}
            <Button
                fullWidth
                color="inherit"
                startIcon={<TuneIcon />}
                onClick={() => setOpen(!open)}
                sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-start', textTransform: 'none' }}>
                <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                    <Typography variant="subtitle2">Filtros {open ? '▲' : '▼'}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap component="div">
                        {daysLabel} · M ≥ {filters.minMag} · {filters.region}
                    </Typography>
                </Box>
            </Button>

            {/* Controles: siempre visibles en escritorio; en móvil solo si open es true */}
            <Grid
                container
                spacing={2}
                sx={{ alignItems: 'center', mt: { xs: open ? 2 : 0, md: 0 }, display: { xs: open ? 'flex' : 'none', md: 'flex' } }}>

                <Grid size={{ xs: 12, md: 2.5 }}>
                    <SelectField
                        id="dias"
                        label="Rango de fechas"
                        value={String(filters.days)}
                        options={DAY_OPTIONS}
                        onOptionSelect={(value) => onChange({ days: Number(value) })} />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <SelectField
                        id="magnitud"
                        label="Magnitud mínima"
                        value={String(filters.minMag)}
                        options={MAG_OPTIONS}
                        onOptionSelect={(value) => onChange({ minMag: Number(value) })} />
                </Grid>

                <Grid size={{ xs: 12, md: 2.5 }}>
                    <SelectField
                        id="region"
                        label="Región / país"
                        value={filters.region}
                        options={regionOptions}
                        onOptionSelect={(value) => onChange({ region: value })} />
                </Grid>

                <Grid size={{ xs: 12, md: 'grow' }} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <FormControlLabel
                        label="Cerca de mí"
                        control={
                            <Switch
                                color="secondary"
                                checked={filters.nearMe}
                                onChange={(event) => onChange({ nearMe: event.target.checked })} />
                        } />
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        disabled={!filters.nearMe}
                        value={filters.radiusKm}
                        onChange={(_event, value: RadiusKm | null) => value && onChange({ radiusKm: value })}>
                        {RADII.map((r) => (
                            <ToggleButton key={r} value={r}>{r} km</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Grid>

                <Grid size={{ xs: 12, md: 'auto' }}>
                    <Button fullWidth onClick={onClear}>Limpiar filtros</Button>
                </Grid>

            </Grid>
        </Card>
    );
}