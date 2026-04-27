import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLayout, PRESETS } from '../core/layoutEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Estado de imágenes: { id, src, file, width, height, aspect }
    const [images, setImages] = useState([]);

    // Configuración
    const [mode, setMode] = useState('SIMPLE'); // 'SIMPLE' | 'ADVANCED'
    const [paperSize, setPaperSize] = useState('A4'); // 'A4' | 'LETTER'

    // En modo avanzado o simple, todo se maneja por un grid exacto
    const [grid, setGrid] = useState({ cols: 2, rows: 2 });

    // Layout calculado automáticamente
    const [pages, setPages] = useState([]);

    // Recalcular layout cuando cambian dependencias
    useEffect(() => {
        if (images.length === 0) {
            setPages([]);
            return;
        }
        const layout = calculateLayout(images, paperSize, grid);
        setPages(layout);
    }, [images, paperSize, grid]);

    const addImages = (newImages) => {
        const enrichedImages = newImages.map(img => ({
            ...img,
            caption: { text: '', size: 14, align: 'center' },
            croppedSrc: null,
            croppedAspect: null
        }));
        setImages(prev => [...prev, ...enrichedImages]);
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const clearImages = () => {
        setImages([]);
    };

    const reorderImages = (dragId, hoverId) => {
        setImages(prev => {
            const dragIndex = prev.findIndex(i => i.id === dragId);
            const hoverIndex = prev.findIndex(i => i.id === hoverId);
            if (dragIndex < 0 || hoverIndex < 0) return prev;
            
            const updated = [...prev];
            const draggedItem = updated[dragIndex];
            updated.splice(dragIndex, 1);
            updated.splice(hoverIndex, 0, draggedItem);
            return updated;
        });
    };

    const updateImageCaption = (id, partialCaption) => {
        setImages(prev => prev.map(img => 
            img.id === id ? { ...img, caption: { ...img.caption, ...partialCaption } } : img
        ));
    };

    const updateImageCrop = (id, croppedSrc, croppedAspect) => {
        setImages(prev => prev.map(img => 
            img.id === id ? { ...img, croppedSrc, croppedAspect } : img
        ));
    };

    const setSimplePreset = (presetGrid) => {
        setGrid(presetGrid);
    };

    return (
        <AppContext.Provider value={{
            images,
            addImages,
            removeImage,
            clearImages,
            reorderImages,
            updateImageCaption,
            updateImageCrop,
            mode,
            setMode,
            paperSize,
            setPaperSize,
            grid,
            setGrid,
            setSimplePreset,
            pages
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
