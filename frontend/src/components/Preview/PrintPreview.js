import React from 'react';
import { useApp } from '../../context/AppContext';
import './PrintPreview.css';

const PrintPreview = () => {
    const { pages, paperSize, addImages } = useApp();

    // Dimensiones base para visualización en pantalla (no afecta impresión real controlada por CSS @page)
    // Usamos una escala para que se vea bien en pantalla
    const getPageStyle = () => {
        // A4: 210mm x 297mm
        // Letter: 215.9mm x 279.4mm
        const isA4 = paperSize === 'A4';
        return {
            aspectRatio: isA4 ? '210/297' : '215.9/279.4',
            maxWidth: '100%'
        };
    };
    const fileInputRef = React.useRef(null);

    const processFiles = (files) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    // Import inside function or use AppContext's addImages via useApp() which is already available
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
                style={{ cursor: 'pointer', border: '2px dashed #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => processFiles(e.target.files)}
                />
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Sube imágenes para ver la vista previa</p>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>Arrastra aquí o haz clic para subir</p>
            </div>
        );
    }

    return (
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
                            className="print-item"
                            style={{
                                position: 'absolute',
                                left: `${item.x}mm`,
                                top: `${item.y}mm`,
                                width: `${item.width}mm`,
                                height: `${item.height}mm`,
                            }}
                        >
                            <img
                                src={item.src}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    ))}
                    <div className="page-number">Página {i + 1}</div>
                </div>
            ))}
        </div>
    );
};

export default PrintPreview;
