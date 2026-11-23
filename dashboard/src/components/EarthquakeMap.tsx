import Box from '@mui/material/Box';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import land from 'world-atlas/land-110m.json';
import { magColor } from '../theme/theme';
import type { Coordinates, EarthquakeWithDistance } from '../types/DashboardTypes';

interface EarthquakeMapProps {
    quakes: EarthquakeWithDistance[];
    user: Coordinates;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

// Proyección del mapa mundial (se calcula una sola vez, fuera del componente).
const WIDTH = 800;
const HEIGHT = 400;
const projection = geoEquirectangular().fitSize([WIDTH, HEIGHT], { type: 'Sphere' });
const topology = land as unknown as Topology<{ land: GeometryCollection }>;
const landPath = geoPath(projection)(feature(topology, topology.objects.land)) ?? '';
const project = (longitude: number, latitude: number) => projection([longitude, latitude]) ?? [0, 0];

export default function EarthquakeMap({ quakes, user, selectedId, onSelect }: EarthquakeMapProps) {
    const [userX, userY] = project(user.longitude, user.latitude);

    return (
        <Box sx={{ height: { xs: 220, md: 340 }, borderRadius: 2, overflow: 'hidden', bgcolor: '#DCEAF7' }}>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                <path d={landPath} fill="#F8FAFC" stroke="#B8C6D6" />
                {quakes.map((quake) => {
                    const [x, y] = project(quake.longitude, quake.latitude);
                    const radius = Math.max(2, ((quake.mag ?? 2.5) - 2) * 2.2); // proporcional a la magnitud
                    const selected = quake.id === selectedId;
                    return (
                        <circle
                            key={quake.id}
                            cx={x}
                            cy={y}
                            r={selected ? radius + 3 : radius}
                            fill={magColor(quake.mag)}
                            fillOpacity={0.75}
                            stroke={selected ? '#0F2A4A' : 'white'}
                            strokeWidth={selected ? 2 : 0.6}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelect(quake.id)}>
                            <title>{`M ${quake.mag} · ${quake.place}`}</title>
                        </circle>
                    );
                })}
                {/* Ubicación del usuario */}
                <circle cx={userX} cy={userY} r={6} fill="#0F2A4A" stroke="white" strokeWidth={2} />
            </svg>
        </Box>
    );
}