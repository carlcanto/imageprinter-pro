import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useApp } from '../../context/AppContext';
import './PrintPreview.css';

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
    const { pages, paperSize, addImages, reorderImages, updateImageCaption, updateImageCrop } = useApp();
    const [cropItem, setCropItem] = useState(null);

    const getPageStyle = () => {
        const isA4 = paperSize === 'A4';
        return {
            aspectRatio: isA4 ? '210/297' : '215.9/279.4',
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

            <div className="print-preview-container">
                {pages.map((page, i) => (
                    <div
                        key={page.id}
                        className={`print-page ${paperSize.toLowerCase()}`}
                        style={getPageStyle()}
                    >
                        {page.items.map((item) => (
                            <div
                                key={item.id}
                                className="print-item interactive"
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, item.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, item.id)}
                                style={{
                                    left: `${item.x}mm`,
                                    top: `${item.y}mm`,
                                    width: `${item.width}mm`,
                                    height: `${item.height}mm`,
                                }}
                            >
                                <div className="item-toolbar">
                                    <button onClick={() => setCropItem(item)} title="Recortar">✂️</button>
                                    <div className="toolbar-divider"></div>
                                    <button onClick={() => updateImageCaption(item.id, { align: 'left' })} title="Alinear Izquierda">⫷</button>
                                    <button onClick={() => updateImageCaption(item.id, { align: 'center' })} title="Centrar">≡</button>
                                    <button onClick={() => updateImageCaption(item.id, { align: 'right' })} title="Alinear Derecha">⫸</button>
                                    <div className="toolbar-divider"></div>
                                    <button onClick={() => updateImageCaption(item.id, { size: (item.caption?.size || 14) + 2 })} title="Agrandar">A<sup>+</sup></button>
                                    <button onClick={() => updateImageCaption(item.id, { size: Math.max(8, (item.caption?.size || 14) - 2) })} title="Achicar">A<sup>-</sup></button>
                                </div>

                                <div className="img-wrapper">
                                    <img
                                        src={item.croppedSrc || item.src}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        draggable={false}
                                    />
                                </div>

                                <input 
                                    className="caption-input"
                                    type="text"
                                    placeholder="Escribir texto..."
                                    value={item.caption?.text || ''}
                                    onChange={(e) => updateImageCaption(item.id, { text: e.target.value })}
                                    style={{
                                        textAlign: item.caption?.align || 'center',
                                        fontSize: `${item.caption?.size || 14}px`,
                                        fontFamily: '"Times New Roman", Times, serif'
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()} 
                                    onKeyDown={(e) => e.stopPropagation()} 
                                />
                            </div>
                        ))}
                        <div className="page-number">Página {i + 1}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PrintPreview;
