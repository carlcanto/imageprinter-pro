import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLayout, PRESETS } from '../core/layoutEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Estado de imágenes: { id, src, file, width, height, aspect }
    const [images, setImages] = useState([]);

    // Configuración
    const [mode, setMode] = useState('SIMPLE'); // 'SIMPLE' | 'ADVANCED'
    const [paperSize, setPaperSize] = useState('A4'); // 'A4' | 'LETTER'

    // En modo simple, la densidad viene de un preset
    // En modo avanzado, es un valor numérico directo
    const [density, setDensity] = useState(PRESETS.MEDIUM);

    // Layout calculado automáticamente
    const [pages, setPages] = useState([]);

    // Recalcular layout cuando cambian dependencias
    useEffect(() => {
        if (images.length === 0) {
            setPages([]);
            return;
        }
        const layout = calculateLayout(images, paperSize, density);
        setPages(layout);
    }, [images, paperSize, density]);

    const addImages = (newImages) => {
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const clearImages = () => {
        setImages([]);
    };

    const setSimplePreset = (presetName) => {
        // PRESETS.BIG, PRESETS.MEDIUM, etc.
        setDensity(presetName);
    };

    return (
        <AppContext.Provider value={{
            images,
            addImages,
            removeImage,
            clearImages,
            mode,
            setMode,
            paperSize,
            setPaperSize,
            density,
            setDensity,
            setSimplePreset,
            pages
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
