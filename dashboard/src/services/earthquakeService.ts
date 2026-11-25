import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';
import type { Earthquake } from '../types/DashboardTypes';

/** Lee una sola vez el nodo "earthquakes" y retorna los sismos como arreglo. */
export async function obtenerSismos(): Promise<Earthquake[]> {
    const referencia = ref(database, 'earthquakes');
    const snapshot = await get(referencia);

    if (!snapshot.exists()) {
        return [];
    }

    const sismos = snapshot.val() as Record<string, Earthquake>;
    return Object.values(sismos);
}