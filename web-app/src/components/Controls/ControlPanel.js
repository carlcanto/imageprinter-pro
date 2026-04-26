import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRESETS } from '../../core/layoutEngine';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './ControlPanel.css';

const ControlPanel = () => {
    const {
        mode, setMode,
        paperSize, setPaperSize,
        density, setDensity,
        setSimplePreset,
        pages
    } = useApp();

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (pages.length === 0) {
            alert('No hay páginas para descargar. Sube algunas imágenes primero.');
            return;
        }

        setIsDownloading(true);

        try {
            const pageElements = document.querySelectorAll('.print-page');
            const isA4 = paperSize === 'A4';

            // Dimensiones en mm
            const pdfWidth = isA4 ? 210 : 215.9;
            const pdfHeight = isA4 ? 297 : 279.4;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: isA4 ? 'a4' : 'letter'
            });

            for (let i = 0; i < pageElements.length; i++) {
                const canvas = await html2canvas(pageElements[i], {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95);

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`imagenes-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Hubo un error al generar el PDF. Intenta de nuevo.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="control-panel glass-panel">
            <div className="control-group">
                <label>Formato de Hoja</label>
                <div className="toggle-group">
                    <button
                        className={paperSize === 'A4' ? 'active' : ''}
                        onClick={() => setPaperSize('A4')}
                    >
                        A4
                    </button>
                    <button
                        className={paperSize === 'LETTER' ? 'active' : ''}
                        onClick={() => setPaperSize('LETTER')}
                    >
                        Carta
                    </button>
                </div>
            </div>

            <div className="divider"></div>

            <div className="control-group">
                <label>Modo</label>
                <div className="toggle-group">
                    <button
                        className={mode === 'SIMPLE' ? 'active' : ''}
                        onClick={() => setMode('SIMPLE')}
                    >
                        Sencillo 🟢
                    </button>
                    <button
                        className={mode === 'ADVANCED' ? 'active' : ''}
                        onClick={() => setMode('ADVANCED')}
                    >
                        Avanzado 🔵
                    </button>
                </div>
            </div>

            <div className="control-content">
                {mode === 'SIMPLE' ? (
                    <div className="simple-controls">
                        <button onClick={() => setSimplePreset(PRESETS.BIG)} className={density === PRESETS.BIG ? 'selected' : ''}>
                            <div className="btn-icon">⬛</div>
                            <span>Grandes</span>
                        </button>
                        <button onClick={() => setSimplePreset(PRESETS.MEDIUM)} className={density === PRESETS.MEDIUM ? 'selected' : ''}>
                            <div className="btn-icon">▦</div>
                            <span>Medianas</span>
                        </button>
                        <button onClick={() => setSimplePreset(PRESETS.SMALL)} className={density === PRESETS.SMALL ? 'selected' : ''}>
                            <div className="btn-icon">▩</div>
                            <span>Pequeñas</span>
                        </button>
                    </div>
                ) : (
                    <div className="advanced-controls">
                        <div className="slider-container extended">
                            <span className="label-left">Grandes</span>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="1"
                                value={density}
                                onChange={(e) => setDensity(Number(e.target.value))}
                            />
                            <span className="label-right">Pequeñas</span>
                        </div>
                        <div className="density-value">Densidad: {density} / 200</div>
                    </div>
                )}
            </div>

            <button
                className="download-btn"
                onClick={handleDownloadPDF}
                disabled={isDownloading || pages.length === 0}
            >
                {isDownloading ? '⏳ Generando...' : '⬇️ Descargar PDF'}
            </button>
        </div>
    );
};

export default ControlPanel;

