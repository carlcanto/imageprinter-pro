/**
 * Servicio de Base de Datos Local usando IndexedDB para ImagePrinter Pro
 * Permite guardar el estado completo de la sesión (imágenes, textos, configuraciones)
 * de forma local sin límites estrictos de tamaño (a diferencia de localStorage).
 */

const DB_NAME = 'ImagePrinterProDB';
const DB_VERSION = 1;
const STORE_NAME = 'sessionStore';
const SESSION_KEY = 'current_session';

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (e) => {
            resolve(e.target.result);
        };

        request.onerror = (e) => {
            console.error('Error abriendo IndexedDB:', e.target.error);
            reject(e.target.error);
        };
    });
};

export const saveSession = async (sessionData) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(sessionData, SESSION_KEY);

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    } catch (error) {
        console.error('Error al guardar sesión en IndexedDB:', error);
        return false;
    }
};

export const getSession = async () => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(SESSION_KEY);

            request.onsuccess = (e) => resolve(e.target.result || null);
            request.onerror = (e) => reject(e.target.error);
        });
    } catch (error) {
        console.error('Error al obtener sesión de IndexedDB:', error);
        return null;
    }
};

export const clearSession = async () => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(SESSION_KEY);

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    } catch (error) {
        console.error('Error al borrar sesión de IndexedDB:', error);
        return false;
    }
};
