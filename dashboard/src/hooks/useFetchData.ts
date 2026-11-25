import { useEffect, useState } from 'react';
import { obtenerSismos } from '../services/earthquakeService';
import type { Earthquake } from '../types/DashboardTypes';

interface FetchDataOutput {
    data: Earthquake[];
    loading: boolean;
    error: string | null;
}

export default function useFetchData(): FetchDataOutput {

    const [data, setData] = useState<Earthquake[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const sismos = await obtenerSismos();
                setData(sismos);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudieron cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []); // [] = solo al cargar el componente

    return { data, loading, error };
}