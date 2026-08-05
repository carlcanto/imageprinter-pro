import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Crop, Type, Trash2, RotateCcw, MoveHorizontal, MoveVertical, Hand, Move } from 'lucide-react';
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
    const [revealedItem, setRevealedItem] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const dragState = useRef(null);
    const hintTimer = useRef(null);

    const isTouch = useCallback(() => typeof window !== 'undefined' && (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window), []);

    useEffect(() => {
        if (pages.length === 0) return;
        if (isTouch()) {
            setShowHint(true);
            hintTimer.current = setTimeout(() => setShowHint(false), 5000);
        }
        return () => { if (hintTimer.current) clearTimeout(hintTimer.current); };
    }, [pages.length, isTouch]);

    const dismissHint = useCallback(() => {
        setShowHint(false);
        if (hintTimer.current) clearTimeout(hintTimer.current);
    }, []);

    const getPageStyle = (page) => {
        const isA4 = paperSize === 'A4';
        const isLandscape = page.orientation === 'LANDSCAPE';
        return { aspectRatio: isA4 ? (isLandscape ? '297/210' : '210/297') : (isLandscape ? '279.4/215.9' : '215.9/279.4'), maxWidth: '100%' };
    };

    const onItemPointerDown = (e, item, pageEl) => {
        if (e.button !== undefined && e.button !== 0) return;
        if (e.target.closest('.item-toolbar') || e.target.closest('.caption-input')) return;
        dismissHint();
        setRevealedItem(item.id);
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        const rect = pageEl.getBoundingClientRect();
        const scaleFactor = rect.width / pageEl.offsetWidth || 1;
        const mmPerPx = 210 / (pageEl.offsetWidth || 210);
        dragState.current = {
            id: item.id,
            startX: e.clientX,
            startY: e.clientY,
            dxMm: 0,
            dyMm: 0,
            dragging: false,
            scaleFactor,
            mmPerPx,
        };
    };

    const onItemPointerMove = (e) => {
        const ds = dragState.current;
        if (!ds) return;
        const dxPx = e.clientX - ds.startX;
        const dyPx = e.clientY - ds.startY;
        if (!ds.dragging && Math.hypot(dxPx, dyPx) < 5) return;
        ds.dragging = true;
        ds.dxMm = dxPx / ds.scaleFactor * ds.mmPerPx;
        ds.dyMm = dyPx / ds.scaleFactor * ds.mmPerPx;
        setRevealedItem(null);
    };

    const onItemPointerUp = (e) => {
        const ds = dragState.current;
        if (!ds) return;
        if (ds.dragging) {
            const pageEl = e.currentTarget.closest('.print-page');
            const pageId = pageEl ? pageEl.dataset.pageId : null;
            const pageObj = pages.find(p => p.id === pageId);
            const dragged = pageObj && pageObj.items.find(it => it.id === ds.id);
            if (dragged) {
                const cx = dragged.x + ds.dxMm + dragged.width / 2;
                const cy = dragged.y + ds.dyMm + dragged.height / 2;
                let best = null;
                let bestDist = Infinity;
                pageObj.items.forEach(other => {
                    if (other.id === ds.id) return;
                    const ocx = other.x + other.width / 2;
                    const ocy = other.y + other.height / 2;
                    const d = Math.hypot(ocx - cx, ocy - cy);
                    if (d < bestDist) { bestDist = d; best = other; }
                });
                if (best && bestDist < 200) reorderImages(ds.id, best.id);
            }
        }
        dragState.current = null;
    };

    const onItemPointerCancel = () => { dragState.current = null; };

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

            <div className="canvas-area" onClick={(e) => { if (!e.target.closest('.print-item')) setRevealedItem(null); }}>
                {showHint && (
                    <div className="mobile-hint">
                        <div className="mobile-hint-gesture">
                            <Hand size={16} strokeWidth={1.5} />
                            <span>{t('preview.hint_tap')}</span>
                        </div>
                        <div className="mobile-hint-gesture">
                            <Move size={16} strokeWidth={1.5} />
                            <span>{t('preview.hint_drag')}</span>
                        </div>
                    </div>
                )}
                <div className="canvas-viewport" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                    {pages.map((page, i) => (
                        <div key={page.id} data-page-id={page.id} className={`print-page ${paperSize.toLowerCase()} ${page.orientation === 'LANDSCAPE' ? 'landscape' : ''} ${i === currentPage ? 'page-visible' : ''}`} style={getPageStyle(page)}>
                            <div className="page-controls-header">
                                <span className="page-badge">{t('preview.page')} {i + 1}</span>
                                <button className="btn-toggle-orientation" onClick={() => togglePageOrientation(i)} title={t('preview.toggle_orientation')}>
                                    {page.orientation === 'LANDSCAPE' ? <><MoveHorizontal size={12} strokeWidth={1.5} /> {t('preview.horizontal')}</> : <><MoveVertical size={12} strokeWidth={1.5} /> {t('preview.vertical')}</>}
                                </button>
                            </div>

                            {page.items.map((item) => {
                                const isDragging = dragState.current?.id === item.id && dragState.current.dragging;
                                const isRevealed = revealedItem === item.id;
                                return (
                                    <div key={item.id} data-item-id={item.id}
                                        className={`print-item interactive ${gridBorders === 'DASHED' ? 'border-dashed' : ''} ${gridBorders === 'PHOTO' ? 'border-photo' : ''} ${captionPosition === 'above' ? 'caption-above' : ''} ${isRevealed ? 'toolbar-revealed' : ''} ${isDragging ? 'dragging' : ''}`}
                                        onPointerDown={(e) => onItemPointerDown(e, item, e.currentTarget.closest('.print-page'))}
                                        onPointerMove={onItemPointerMove}
                                        onPointerUp={onItemPointerUp}
                                        onPointerCancel={onItemPointerCancel}
                                        style={{
                                            left: `${item.x}mm`,
                                            top: `${item.y}mm`,
                                            width: `${item.width}mm`,
                                            height: `${item.height}mm`,
                                            transform: isDragging ? `translate(${dragState.current.dxMm}mm, ${dragState.current.dyMm}mm)` : undefined,
                                            zIndex: isDragging ? 100 : undefined,
                                        }}>

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
                                );
                            })}
                            <div className="page-number">{t('preview.page')} {i + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PrintPreview;
