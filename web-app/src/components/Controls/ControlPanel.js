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
        grid, setGrid,
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

    const isGridEqual = (g1, g2) => g1.cols === g2.cols && g1.rows === g2.rows;

    return (
        <div className="control-panel glass-panel">
            <div className="info-message">
                <span role="img" aria-label="info">💡</span> 
                Tienes el <b>control total</b>. Elige una distribución rápida o crea tu propia matriz en modo Avanzado.
            </div>

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
                        Formatos 🟢
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
                    <div className="simple-controls grid-presets">
                        {PRESETS.map((preset, index) => (
                            <button 
                                key={index}
                                onClick={() => setSimplePreset(preset)} 
                                className={isGridEqual(grid, preset) ? 'selected' : ''}
                            >
                                <div className="btn-icon">▦</div>
                                <span>{preset.cols}x{preset.rows}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="advanced-controls">
                        <label className="advanced-title">Matriz Personalizada</label>
                        <div className="inputs-container">
                            <div className="input-group">
                                <label>Columnas</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={grid.cols}
                                    onChange={(e) => setGrid({...grid, cols: Number(e.target.value)})}
                                />
                            </div>
                            <span className="cross-icon">×</span>
                            <div className="input-group">
                                <label>Filas</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={grid.rows}
                                    onChange={(e) => setGrid({...grid, rows: Number(e.target.value)})}
                                />
                            </div>
                        </div>
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

