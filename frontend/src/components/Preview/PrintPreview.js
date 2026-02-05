import React from 'react';
import { useApp } from '../../context/AppContext';
import './PrintPreview.css';

const PrintPreview = () => {
    const { pages, paperSize } = useApp();

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

    if (pages.length === 0) {
        return (
            <div className="preview-placeholder">
                <p>Sube imágenes para ver la vista previa</p>
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
