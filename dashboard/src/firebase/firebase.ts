import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuración del proyecto (Firebase console > Configuración del proyecto > Tus apps).
// La apiKey identifica el proyecto; el acceso a los datos lo controlan las reglas de seguridad.
const firebaseConfig = {
    apiKey: 'AIzaSyDlKUymCsGte4utB9uSQUYVnlz7glri37I',
    authDomain: 'monitor-sismos-14b6f.firebaseapp.com',
    databaseURL: 'https://monitor-sismos-14b6f-default-rtdb.firebaseio.com',
    projectId: 'monitor-sismos-14b6f',
    storageBucket: 'monitor-sismos-14b6f.firebasestorage.app',
    messagingSenderId: '355417569908',
    appId: '1:355417569908:web:245f108fdb4b0115fbaf21',
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);