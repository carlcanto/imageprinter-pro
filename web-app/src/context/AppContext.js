import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLayout } from '../core/layoutEngine';
import { saveSession, getSession } from '../services/db';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [images, setImages] = useState([]);

    const [mode, setMode] = useState('SIMPLE');
    const [paperSize, setPaperSize] = useState('A4');
    const [grid, setGrid] = useState({ cols: 2, rows: 2 });
    const [pageOrientations, setPageOrientations] = useState({});
    const [defaultOrientation, setDefaultOrientation] = useState('PORTRAIT');
    const [marginSize, setMarginSize] = useState('NORMAL');
    const [gridBorders, setGridBorders] = useState('NONE');
    const [isLoaded, setIsLoaded] = useState(false);

    const [imageScale, setImageScale] = useState(0.95);
    const [captionPosition, setCaptionPosition] = useState('below');
    const [exportQuality, setExportQuality] = useState(0.95);

    const [pages, setPages] = useState([]);

    useEffect(() => {
        if (images.length === 0) {
            setPages([]);
            return;
        }
        const selectedImages = images.filter(img => img.selected !== false);
        const layout = calculateLayout(selectedImages, paperSize, grid, pageOrientations, marginSize, defaultOrientation, imageScale);
        setPages(layout);
    }, [images, paperSize, grid, pageOrientations, marginSize, defaultOrientation, imageScale]);

    useEffect(() => {
        const loadSavedSession = async () => {
            try {
                const saved = await getSession();
                if (saved) {
                    if (saved.images) setImages(saved.images);
                    if (saved.mode) setMode(saved.mode);
                    if (saved.paperSize) setPaperSize(saved.paperSize);
                    if (saved.grid) setGrid(saved.grid);
                    if (saved.pageOrientations) setPageOrientations(saved.pageOrientations);
                    if (saved.defaultOrientation) setDefaultOrientation(saved.defaultOrientation);
                    if (saved.marginSize) setMarginSize(saved.marginSize);
                    if (saved.gridBorders) setGridBorders(saved.gridBorders);
                    if (saved.imageScale) setImageScale(saved.imageScale);
                    if (saved.captionPosition) setCaptionPosition(saved.captionPosition);
                    if (saved.exportQuality) setExportQuality(saved.exportQuality);
                }
            } catch (error) {
                console.error('Error al cargar la sesión desde IndexedDB:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadSavedSession();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const saveData = {
            images, mode, paperSize, grid, pageOrientations,
            defaultOrientation, marginSize, gridBorders,
            imageScale, captionPosition, exportQuality
        };
        saveSession(saveData);
    }, [images, mode, paperSize, grid, pageOrientations, defaultOrientation, marginSize, gridBorders, imageScale, captionPosition, exportQuality, isLoaded]);

    const addImages = (newImages) => {
        const enrichedImages = newImages.map(img => ({
            ...img,
            selected: false,
            caption: { text: '', size: 14, align: 'center', enabled: false },
            croppedSrc: null,
            croppedAspect: null
        }));
        setImages(prev => [...prev, ...enrichedImages]);
    };

    const removeImage = (id) => setImages(prev => prev.filter(img => img.id !== id));

    const clearImages = () => { setImages([]); setPageOrientations({}); };

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

    const toggleImageSelection = (id) => {
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, selected: !(img.selected !== false) } : img
        ));
    };

    const selectAllImages = () => setImages(prev => prev.map(img => ({ ...img, selected: true })));
    const deselectAllImages = () => setImages(prev => prev.map(img => ({ ...img, selected: false })));

    const setSimplePreset = (presetGrid) => setGrid(presetGrid);

    const togglePageOrientation = (pageIndex) => {
        setPageOrientations(prev => {
            const current = prev[pageIndex] || defaultOrientation;
            const next = current === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT';
            return { ...prev, [pageIndex]: next };
        });
    };

    const setGlobalOrientation = (orientation) => { setDefaultOrientation(orientation); setPageOrientations({}); };
    const toggleAllCaptions = (enabled) => setImages(prev => prev.map(img => ({ ...img, caption: { ...img.caption, enabled } })));

    return (
        <AppContext.Provider value={{
            images, addImages, removeImage, clearImages, reorderImages,
            updateImageCaption, updateImageCrop,
            toggleImageSelection, selectAllImages, deselectAllImages,
            mode, setMode,
            paperSize, setPaperSize,
            grid, setGrid, setSimplePreset,
            pages,
            pageOrientations, togglePageOrientation,
            defaultOrientation, setGlobalOrientation,
            marginSize, setMarginSize,
            gridBorders, setGridBorders,
            toggleAllCaptions,
            imageScale, setImageScale,
            captionPosition, setCaptionPosition,
            exportQuality, setExportQuality
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
