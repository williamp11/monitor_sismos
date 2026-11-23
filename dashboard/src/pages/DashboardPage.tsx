import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FunctionsIcon from '@mui/icons-material/Functions';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BoltIcon from '@mui/icons-material/Bolt';
import LayersIcon from '@mui/icons-material/Layers';
import PlaceIcon from '@mui/icons-material/Place';

import Header from '../components/Header';
import NearMeButton from '../components/NearMeButton';
import FilterBar from '../components/FilterBar';
import KpiGrid, { type KpiItem } from '../components/KpiGrid';
import SectionCard from '../components/SectionCard';
import DailyActivityChart from '../components/DailyActivityChart';
import ReviewStatusChart from '../components/ReviewStatusChart';
import TopRegionsChart from '../components/TopRegionsChart';
import EarthquakeMap from '../components/EarthquakeMap';
import EarthquakeDetailCard from '../components/EarthquakeDetailCard';
import NearbyQuakesTable from '../components/NearbyQuakesTable';
import NearbyQuakeList from '../components/NearbyQuakeList';
import StateMessage from '../components/StateMessage';

import { DEFAULT_FILTERS, REFERENCE_DATE, SAMPLE_USER_CITY, SAMPLE_USER_LOCATION, sampleEarthquakes } from '../data/sampleData';
import type { Filters } from '../types/DashboardTypes';
import {
    applyFilters, computeKpis, countByDay, fmt1, fmtKm, formatDateTime,
    regionOptions, statusShare, timeAgo, topRegions, withDistance,
} from '../utils/earthquakeStats';

// Datos de ejemplo con la distancia al usuario (no cambian, por eso van fuera del componente).
const allQuakes = withDistance(sampleEarthquakes, SAMPLE_USER_LOCATION);
const regions = regionOptions(applyFilters(allQuakes, DEFAULT_FILTERS, REFERENCE_DATE));

export default function DashboardPage() {

    // Estado del dashboard
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Funciones que los hijos reciben por props para cambiar el estado
    const handleFilterChange = (changes: Partial<Filters>) => {
        setFilters({ ...filters, ...changes });
    };

    const handleClear = () => {
        setFilters(DEFAULT_FILTERS);
        setSelectedId(null);
    };

    // Datos derivados: se recalculan en cada renderizado a partir del estado
    const quakes = applyFilters(allQuakes, filters, REFERENCE_DATE);
    const kpis = computeKpis(quakes);
    const daily = countByDay(quakes, filters.days, REFERENCE_DATE);
    const status = statusShare(quakes);
    const ranking = topRegions(quakes);
    const nearest = [...quakes].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
    const selected = quakes.find((q) => q.id === selectedId) ?? kpis.nearest;

    const kpiItems: KpiItem[] = [
        { id: 'total', title: 'Total de sismos', value: String(kpis.total), helper: `Últimos ${filters.days} días`, icon: <FunctionsIcon /> },
        { id: 'avg', title: 'Magnitud promedio', value: fmt1(kpis.avgMag), helper: 'Del periodo', icon: <ShowChartIcon /> },
        { id: 'max', title: 'Magnitud máxima', value: fmt1(kpis.maxMag), helper: 'Evento más fuerte', icon: <BoltIcon />, accent: true },
        { id: 'depth', title: 'Profundidad promedio', value: kpis.avgDepth === null ? '—' : `${Math.round(kpis.avgDepth)} km`, helper: 'Hipocentro', icon: <LayersIcon />, desktopOnly: true },
        {
            id: 'nearest',
            title: 'Sismo más cercano',
            value: kpis.nearest ? fmtKm(kpis.nearest.distanceKm) : '—',
            helper: kpis.nearest ? `M ${fmt1(kpis.nearest.mag)} · ${timeAgo(kpis.nearest.time, REFERENCE_DATE)}` : 'Sin datos',
            icon: <PlaceIcon />,
        },
    ];

    const emptyMessage = (
        <StateMessage
            message="No hay sismos con estos filtros."
            actionLabel="Limpiar filtros"
            onAction={handleClear} />
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

            {/* Encabezado */}
            <Header
                title="Monitor de Sismos USGS"
                source="USGS Earthquake Hazards Program"
                updatedAt={formatDateTime(REFERENCE_DATE.toISOString())}
                alertCount={quakes.filter((q) => (q.mag ?? 0) >= 6).length} />

            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
                <Grid container spacing={{ xs: 2, md: 3 }}>

                    {/* Botón "Cerca de mí" (solo móvil) */}
                    <Grid size={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                        <NearMeButton
                            active={filters.nearMe}
                            onClick={() => handleFilterChange({ nearMe: !filters.nearMe })} />
                    </Grid>

                    {/* Filtros */}
                    <Grid size={12}>
                        <FilterBar
                            filters={filters}
                            regions={regions}
                            onChange={handleFilterChange}
                            onClear={handleClear} />
                    </Grid>

                    {/* Indicadores */}
                    <Grid size={12}>
                        <KpiGrid items={kpiItems} />
                    </Grid>

                    {/* Gráfico de líneas */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <SectionCard title="Actividad sísmica diaria" subtitle={`Sismos por día · últimos ${filters.days} días`}>
                            <DailyActivityChart labels={daily.map((d) => d.label)} values={daily.map((d) => d.count)} />
                        </SectionCard>
                    </Grid>

                    {/* Gráfico de dona */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <SectionCard title="Estado de revisión" subtitle="Revisados por un analista vs. automáticos">
                            {quakes.length === 0
                                ? emptyMessage
                                : <ReviewStatusChart reviewed={status.reviewed} automatic={status.automatic} />}
                        </SectionCard>
                    </Grid>

                    {/* Mapa */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <SectionCard title="Sismos cerca de mí" subtitle={`Ubicación de ejemplo: ${SAMPLE_USER_CITY}`}>
                            <EarthquakeDetailCard quake={selected} />
                            <EarthquakeMap
                                quakes={quakes}
                                user={SAMPLE_USER_LOCATION}
                                selectedId={selected?.id ?? null}
                                onSelect={setSelectedId} />
                        </SectionCard>
                    </Grid>

                    {/* Gráfico de barras */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <SectionCard title="Top 5 regiones" subtitle="Regiones con más sismos">
                            {quakes.length === 0
                                ? emptyMessage
                                : <TopRegionsChart
                                    regions={ranking.map((r) => r.region)}
                                    counts={ranking.map((r) => r.count)}
                                    onRegionSelect={(region) => handleFilterChange({ region })} />}
                        </SectionCard>
                    </Grid>

                    {/* Tabla (escritorio) y tarjetas (móvil) */}
                    <Grid size={12}>
                        <SectionCard title="Sismos más cercanos" subtitle={`Distancia desde ${SAMPLE_USER_CITY}`}>
                            {quakes.length === 0 && emptyMessage}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <NearbyQuakesTable quakes={nearest} onSelect={setSelectedId} />
                            </Box>
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <NearbyQuakeList quakes={nearest} onSelect={setSelectedId} />
                            </Box>
                        </SectionCard>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}