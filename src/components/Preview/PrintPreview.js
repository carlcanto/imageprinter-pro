import React, { useState, useRef } from 'react';
import { Crop, Type, Trash2, RotateCcw, MoveHorizontal, MoveVertical } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useApp } from '../../context/AppContext';
import useTranslation from '../../hooks/useTranslation';
import './PrintPreview.css';

const CropModal = ({ isOpen, image, onClose, onSave }) => {
    const { t } = useTranslation();
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
        if (!imgRef.current) { onClose(); return; }
        const imageElement = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = imageElement.naturalWidth / imageElement.width;
        const scaleY = imageElement.naturalHeight / imageElement.height;
        const cropActual = crop || centerCrop(makeAspectCrop({ unit: '%', width: 100 }, 1, imageElement.width, imageElement.height), imageElement.width, imageElement.height);

        canvas.width = cropActual.width * scaleX;
        canvas.height = cropActual.height * scaleY;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageElement, cropActual.x * scaleX, cropActual.y * scaleY, cropActual.width * scaleX, cropActual.height * scaleY, 0, 0, cropActual.width * scaleX, cropActual.height * scaleY);
        const base64Image = canvas.toDataURL('image/jpeg', 0.95);
        onSave(base64Image, canvas.width / canvas.height);
    };

    if (!isOpen || !image) return null;

    return (
        <div className="crop-modal">
            <div className="crop-modal-content">
                <h3>{t('preview.crop')}</h3>
                <div className="crop-container">
                    <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                        <img ref={imgRef} src={image.src} alt="Crop preview" onLoad={onImageLoad} style={{ maxHeight: '60vh', maxWidth: '100%' }} />
                    </ReactCrop>
                </div>
                <div className="crop-actions">
                    <button onClick={onClose} className="btn-cancel">{t('preview.cancel')}</button>
                    <button onClick={handleSave} className="btn-save"><Crop size={14} strokeWidth={1.5} /> {t('preview.save_crop')}</button>
                </div>
            </div>
        </div>
    );
};

const PrintPreview = ({ currentPage = 0, zoom = 1 }) => {
    const { t } = useTranslation();
    const {
        pages, images,
        paperSize,
        reorderImages,
        updateImageCaption,
        updateImageCrop,
        removeImage,
        gridBorders,
        togglePageOrientation,
        captionPosition
    } = useApp();
    const [cropItem, setCropItem] = useState(null);

    const getPageStyle = (page) => {
        const isA4 = paperSize === 'A4';
        const isLandscape = page.orientation === 'LANDSCAPE';
        return { aspectRatio: isA4 ? (isLandscape ? '297/210' : '210/297') : (isLandscape ? '279.4/215.9' : '215.9/279.4'), maxWidth: '100%' };
    };

    const handleDragStart = (e, id) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; };
    const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const dragId = e.dataTransfer.getData('text/plain');
        if (dragId && dragId !== targetId) reorderImages(dragId, targetId);
    };

    if (pages.length === 0) {
        return (
            <div className="canvas-area">
                {images.length > 0 && <div className="canvas-empty"><p>{t('preview.empty')}</p></div>}
            </div>
        );
    }

    return (
        <>
            <CropModal isOpen={!!cropItem} image={cropItem} onClose={() => setCropItem(null)} onSave={(base64, aspect) => { updateImageCrop(cropItem.id, base64, aspect); setCropItem(null); }} />

            <div className="canvas-area">
                <div className="canvas-viewport" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                    {pages.map((page, i) => (
                        <div key={page.id} className={`print-page ${paperSize.toLowerCase()} ${page.orientation === 'LANDSCAPE' ? 'landscape' : ''} ${i === currentPage ? 'page-visible' : ''}`} style={getPageStyle(page)}>
                            <div className="page-controls-header">
                                <span className="page-badge">{t('preview.page')} {i + 1}</span>
                                <button className="btn-toggle-orientation" onClick={() => togglePageOrientation(i)} title={t('preview.toggle_orientation')}>
                                    {page.orientation === 'LANDSCAPE' ? <><MoveHorizontal size={12} strokeWidth={1.5} /> {t('preview.horizontal')}</> : <><MoveVertical size={12} strokeWidth={1.5} /> {t('preview.vertical')}</>}
                                </button>
                            </div>

                            {page.items.map((item) => (
                                <div key={item.id} className={`print-item interactive ${gridBorders === 'DASHED' ? 'border-dashed' : ''} ${gridBorders === 'PHOTO' ? 'border-photo' : ''} ${captionPosition === 'above' ? 'caption-above' : ''}`}
                                    draggable={true} onDragStart={(e) => handleDragStart(e, item.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, item.id)}
                                    style={{ left: `${item.x}mm`, top: `${item.y}mm`, width: `${item.width}mm`, height: `${item.height}mm` }}>

                                    <div className="item-toolbar">
                                        <button onClick={() => setCropItem(item)} title={t('preview.crop')}><Crop size={14} strokeWidth={1.5} /></button>
                                        <button onClick={() => updateImageCaption(item.id, { enabled: !item.caption?.enabled })} className={item.caption?.enabled ? 'active-tool' : ''} title={item.caption?.enabled ? t('preview.hide_text') : t('preview.write_text')}><Type size={14} strokeWidth={1.5} /></button>
                                        {item.croppedSrc && <button onClick={() => updateImageCrop(item.id, null, null)} title={t('preview.restore')}><RotateCcw size={14} strokeWidth={1.5} /></button>}
                                        <button onClick={() => removeImage(item.id)} className="btn-delete" title={t('preview.delete')}><Trash2 size={14} strokeWidth={1.5} /></button>
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
                                        <img src={item.croppedSrc || item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
                                    </div>

                                    {item.caption?.enabled && (
                                        <>
                                            <input className="caption-input" type="text" placeholder={t('preview.write_text')} value={item.caption?.text || ''}
                                                onChange={(e) => updateImageCaption(item.id, { text: e.target.value })}
                                                style={{ textAlign: item.caption?.align || 'center', fontSize: `${item.caption?.size || 14}px`, fontFamily: '"Times New Roman", Times, serif' }}
                                                onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} />
                                            <div className="caption-display-print" style={{ textAlign: item.caption?.align || 'center', fontSize: `${item.caption?.size || 14}px`, fontFamily: '"Times New Roman", Times, serif' }}>
                                                {item.caption?.text || ''}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div className="page-number">{t('preview.page')} {i + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PrintPreview;
