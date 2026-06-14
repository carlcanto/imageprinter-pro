import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useApp } from '../../context/AppContext';
import './PrintPreview.css';

const MM_TO_PX = 96 / 25.4;

const getPageWidth = (page, paperSize) => {
    const isA4 = paperSize === 'A4';
    const isLandscape = page.orientation === 'LANDSCAPE';
    if (isA4) return isLandscape ? 297 : 210;
    return isLandscape ? 215.9 : 279.4;
};

const CropModal = ({ isOpen, image, onClose, onSave }) => {
    const [crop, setCrop] = useState(null);
    const imgRef = useRef(null);

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const _crop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
            width,
            height
        );
        setCrop(_crop);
    };

    const handleSave = () => {
        if (!imgRef.current) {
            onClose();
            return;
        }
        
        const imageElement = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = imageElement.naturalWidth / imageElement.width;
        const scaleY = imageElement.naturalHeight / imageElement.height;
        
        // Si no hizo cambios en el crop, usamos el centro como default o lo cancelamos
        const cropActual = crop || centerCrop(makeAspectCrop({ unit: '%', width: 100 }, 1, imageElement.width, imageElement.height), imageElement.width, imageElement.height);

        canvas.width = cropActual.width * scaleX;
        canvas.height = cropActual.height * scaleY;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            imageElement,
            cropActual.x * scaleX,
            cropActual.y * scaleY,
            cropActual.width * scaleX,
            cropActual.height * scaleY,
            0,
            0,
            cropActual.width * scaleX,
            cropActual.height * scaleY
        );

        const base64Image = canvas.toDataURL('image/jpeg', 0.95);
        onSave(base64Image, canvas.width / canvas.height);
    };

    if (!isOpen || !image) return null;

    return (
        <div className="crop-modal">
            <div className="crop-modal-content">
                <h3>Recortar Imagen</h3>
                <div className="crop-container">
                    <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                        <img 
                            ref={imgRef} 
                            src={image.src} 
                            alt="Crop preview" 
                            onLoad={onImageLoad}
                            style={{ maxHeight: '60vh', maxWidth: '100%' }}
                        />
                    </ReactCrop>
                </div>
                <div className="crop-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleSave} className="btn-save">✂️ Guardar Recorte</button>
                </div>
            </div>
        </div>
    );
};

const PrintPreview = () => {
    const { 
        pages, 
        paperSize, 
        addImages, 
        reorderImages, 
        updateImageCaption, 
        updateImageCrop, 
        removeImage,
        gridBorders,
        togglePageOrientation
    } = useApp();
    const [cropItem, setCropItem] = useState(null);
    const [activeToolbarId, setActiveToolbarId] = useState(null);
    const [pageScale, setPageScale] = useState(1);
    const containerRef = useRef(null);

    const handleItemClick = (id) => {
        setActiveToolbarId(prev => prev === id ? null : id);
    };

    const measureScale = useCallback(() => {
        const container = containerRef.current;
        if (!container || pages.length === 0) {
            setPageScale(1);
            return;
        }
        const containerWidth = container.clientWidth;
        if (containerWidth <= 0) return;
        const pageWidthMm = getPageWidth(pages[0], paperSize);
        const pageWidthPx = pageWidthMm * MM_TO_PX;
        if (pageWidthPx > containerWidth) {
            setPageScale(containerWidth / pageWidthPx);
        } else {
            setPageScale(1);
        }
    }, [pages, paperSize]);

    useLayoutEffect(() => {
        measureScale();
        const observer = new ResizeObserver(measureScale);
        const container = containerRef.current;
        if (container) observer.observe(container);
        return () => observer.disconnect();
    }, [measureScale]);

    const getPageStyle = (page) => {
        const isA4 = paperSize === 'A4';
        const isLandscape = page.orientation === 'LANDSCAPE';
        let aspect;
        if (isA4) {
            aspect = isLandscape ? '297/210' : '210/297';
        } else {
            aspect = isLandscape ? '279.4/215.9' : '215.9/279.4';
        }
        return {
            aspectRatio: aspect,
            maxWidth: '100%'
        };
    };
    
    // Drag and Drop para imágenes
    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const dragId = e.dataTransfer.getData('text/plain');
        if (dragId && dragId !== targetId) {
            reorderImages(dragId, targetId);
        }
    };

    // Subida de Archivos General
    const fileInputRef = useRef(null);
    const processFiles = (files) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    addImages([{
                        id: Date.now() + Math.random().toString(),
                        src: img.src,
                        file: file,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        aspect: img.naturalWidth / img.naturalHeight
                    }]);
                };
            };
            reader.readAsDataURL(file);
        });
    };

    if (pages.length === 0) {
        return (
            <div
                className="preview-placeholder"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); processFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => processFiles(e.target.files)}
                />
                <span className="icon-placeholder">📁</span>
                <p className="title-placeholder">Sube imágenes para ver la vista previa</p>
                <p className="subtitle-placeholder">Arrastra aquí o haz clic para subir</p>
            </div>
        );
    }

    return (
        <>
            <CropModal 
                isOpen={!!cropItem} 
                image={cropItem} 
                onClose={() => setCropItem(null)} 
                onSave={(base64, aspect) => {
                    updateImageCrop(cropItem.id, base64, aspect);
                    setCropItem(null);
                }} 
            />

            <div className="print-preview-container" ref={containerRef}>
                {pages.map((page, i) => {
                    const pageWidthMm = getPageWidth(page, paperSize);
                    const pageRatio = page.height / page.width;
                    const scaledHeight = pageWidthMm * pageRatio * pageScale;
                    return <div
                        key={page.id}
                        className="print-page-wrapper"
                        style={{ height: `${scaledHeight * MM_TO_PX}px` }}
                    >
                        <div
                            className={`print-page ${paperSize.toLowerCase()} ${page.orientation === 'LANDSCAPE' ? 'landscape' : ''}`}
                            style={{
                                ...getPageStyle(page),
                                transform: pageScale < 1 ? `scale(${pageScale})` : 'none',
                                transformOrigin: 'top center',
                            }}
                        >
                        <div className="page-controls-header">
                            <span className="page-badge">Página {i + 1}</span>
                            <button 
                                className="btn-toggle-orientation" 
                                onClick={() => togglePageOrientation(i)}
                                title="Cambiar orientación de esta página"
                            >
                                {page.orientation === 'LANDSCAPE' ? '↔️ Horizontal' : '↕️ Vertical'}
                            </button>
                        </div>

                        {page.items.map((item) => (
                            <div
                                key={item.id}
                                className={`print-item interactive ${gridBorders === 'DASHED' ? 'border-dashed' : ''} ${gridBorders === 'PHOTO' ? 'border-photo' : ''} ${activeToolbarId === item.id ? 'toolbar-active' : ''}`}
                                draggable={false}
                                onDragStart={(e) => handleDragStart(e, item.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, item.id)}
                                onClick={() => handleItemClick(item.id)}
                                style={{
                                    left: `${item.x}mm`,
                                    top: `${item.y}mm`,
                                    width: `${item.width}mm`,
                                    height: `${item.height}mm`,
                                }}
                            >
                                <div className="item-toolbar">
                                    <button onClick={() => setCropItem(item)} title="Recortar Imagen">✂️</button>
                                    
                                    <button 
                                        onClick={() => updateImageCaption(item.id, { enabled: !item.caption?.enabled })} 
                                        className={item.caption?.enabled ? 'active-tool' : ''} 
                                        title={item.caption?.enabled ? "Ocultar Texto" : "Escribir Texto"}
                                    >
                                        📝
                                    </button>

                                    {item.croppedSrc && (
                                        <button onClick={() => updateImageCrop(item.id, null, null)} title="Restaurar Original">🔄</button>
                                    )}

                                    <button onClick={() => removeImage(item.id)} className="btn-delete" title="Eliminar Imagen">🗑️</button>

                                    {item.caption?.enabled && (
                                        <>
                                            <div className="toolbar-divider"></div>
                                            <button onClick={() => updateImageCaption(item.id, { align: 'left' })} title="Alinear Izquierda">⫷</button>
                                            <button onClick={() => updateImageCaption(item.id, { align: 'center' })} title="Centrar Texto">≡</button>
                                            <button onClick={() => updateImageCaption(item.id, { align: 'right' })} title="Alinear Derecha">⫸</button>
                                            <div className="toolbar-divider"></div>
                                            <button onClick={() => updateImageCaption(item.id, { size: (item.caption?.size || 14) + 2 })} title="Aumentar Tamaño">A<sup>+</sup></button>
                                            <button onClick={() => updateImageCaption(item.id, { size: Math.max(8, (item.caption?.size || 14) - 2) })} title="Disminuir Tamaño">A<sup>-</sup></button>
                                        </>
                                    )}
                                </div>

                                <div className="img-wrapper">
                                    <img
                                        src={item.croppedSrc || item.src}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                draggable={true}
                                    />
                                </div>

                                {item.caption?.enabled && (
                                    <>
                                        <input 
                                            className="caption-input"
                                            type="text"
                                            placeholder="Escribir texto..."
                                            value={item.caption?.text || ''}
                                            onChange={(e) => updateImageCaption(item.id, { text: e.target.value })}
                                            style={{
                                                textAlign: item.caption?.align || 'center',
                                                fontSize: `${item.caption?.size || 14}px`
                                            }}
                                            onPointerDown={(e) => e.stopPropagation()} 
                                            onKeyDown={(e) => e.stopPropagation()} 
                                        />
                                        <div 
                                            className="caption-display-print"
                                            style={{
                                                textAlign: item.caption?.align || 'center',
                                                fontSize: `${item.caption?.size || 14}px`
                                            }}
                                        >
                                            {item.caption?.text || ''}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <div className="page-number">Página {i + 1}</div>
                        </div>
                    </div>;
                })}
            </div>
        </>
    );
};

export default PrintPreview;
