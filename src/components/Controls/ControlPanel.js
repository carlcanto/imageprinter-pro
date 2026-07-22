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
        pages,
        clearImages,
        marginSize, setMarginSize,
        gridBorders, setGridBorders,
        defaultOrientation, setGlobalOrientation,
        toggleAllCaptions
    } = useApp();

    const [isDownloading, setIsDownloading] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);

    const handleDownloadPDF = async () => {
        if (pages.length === 0) {
            alert('No hay páginas para descargar. Sube algunas imágenes primero.');
            return;
        }

        setIsDownloading(true);

        try {
            const pageElements = document.querySelectorAll('.print-page');
            const isA4 = paperSize === 'A4';

            // Dimensiones base en mm
            const pdfWidthBase = isA4 ? 210 : 215.9;
            const pdfHeightBase = isA4 ? 297 : 279.4;

            // Determinar orientación de la primera página
            const firstPageIsLandscape = pages[0]?.orientation === 'LANDSCAPE';

            const pdf = new jsPDF({
                orientation: firstPageIsLandscape ? 'landscape' : 'portrait',
                unit: 'mm',
                format: isA4 ? 'a4' : 'letter'
            });

            for (let i = 0; i < pageElements.length; i++) {
                pageElements[i].classList.add('html2canvas-exporting');
                const canvas = await html2canvas(pageElements[i], {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                pageElements[i].classList.remove('html2canvas-exporting');

                const imgData = canvas.toDataURL('image/jpeg', 0.95);

                const isPageLandscape = pages[i]?.orientation === 'LANDSCAPE';
                const currentWidth = isPageLandscape ? pdfHeightBase : pdfWidthBase;
                const currentHeight = isPageLandscape ? pdfWidthBase : pdfHeightBase;

                if (i > 0) {
                    pdf.addPage(isA4 ? 'a4' : 'letter', isPageLandscape ? 'landscape' : 'portrait');
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, currentWidth, currentHeight);
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

            {/* ─── SECCIÓN SIMPLE ─── */}
            <div className="panel-section">
                <div className="section-label">Formato de Papel</div>
                <div className="toggle-group">
                    <button
                        className={paperSize === 'A4' ? 'active' : ''}
                        onClick={() => setPaperSize('A4')}
                    >A4</button>
                    <button
                        className={paperSize === 'LETTER' ? 'active' : ''}
                        onClick={() => setPaperSize('LETTER')}
                    >Carta</button>
                </div>
            </div>

            <div className="panel-section">
                <div className="section-label">Distribución Rápida</div>
                <div className="grid-presets">
                    {PRESETS.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => { setSimplePreset(preset); setMode('SIMPLE'); }}
                            className={isGridEqual(grid, preset) && mode === 'SIMPLE' ? 'selected' : ''}
                        >
                            <div className="btn-icon">▦</div>
                            <span>{preset.cols}×{preset.rows}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── AVANZADO: ACORDEÓN ─── */}
            <button
                className={`advanced-toggle ${advancedOpen ? 'open' : ''}`}
                onClick={() => setAdvancedOpen(v => !v)}
            >
                <span>⚙️ Opciones Avanzadas</span>
                <span className="chevron">{advancedOpen ? '▲' : '▼'}</span>
            </button>

            {advancedOpen && (
                <div className="advanced-section">

                    {/* Matriz personalizada */}
                    <div className="panel-section">
                        <div className="section-label">Matriz Personalizada</div>
                        <div className="inputs-container">
                            <div className="input-group">
                                <label>Cols</label>
                                <input
                                    type="number" min="1" max="20"
                                    value={grid.cols}
                                    onChange={(e) => { setGrid({ ...grid, cols: Number(e.target.value) }); setMode('ADVANCED'); }}
                                />
                            </div>
                            <span className="cross-icon">×</span>
                            <div className="input-group">
                                <label>Filas</label>
                                <input
                                    type="number" min="1" max="20"
                                    value={grid.rows}
                                    onChange={(e) => { setGrid({ ...grid, rows: Number(e.target.value) }); setMode('ADVANCED'); }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="adv-divider" />

                    {/* Orientación Global */}
                    <div className="panel-section">
                        <div className="section-label">Orientación Global</div>
                        <div className="toggle-group">
                            <button
                                className={defaultOrientation === 'PORTRAIT' ? 'active' : ''}
                                onClick={() => setGlobalOrientation('PORTRAIT')}
                            >↕️ Retrato</button>
                            <button
                                className={defaultOrientation === 'LANDSCAPE' ? 'active' : ''}
                                onClick={() => setGlobalOrientation('LANDSCAPE')}
                            >↔️ Paisaje</button>
                        </div>
                    </div>

                    <div className="adv-divider" />

                    {/* Márgenes */}
                    <div className="panel-section">
                        <div className="section-label">Márgenes</div>
                        <div className="select-buttons-grid">
                            <button className={marginSize === 'NONE' ? 'active' : ''} onClick={() => setMarginSize('NONE')}>Ninguno</button>
                            <button className={marginSize === 'THIN' ? 'active' : ''} onClick={() => setMarginSize('THIN')}>Finos</button>
                            <button className={marginSize === 'NORMAL' ? 'active' : ''} onClick={() => setMarginSize('NORMAL')}>Normal</button>
                            <button className={marginSize === 'WIDE' ? 'active' : ''} onClick={() => setMarginSize('WIDE')}>Anchos</button>
                        </div>
                    </div>

                    <div className="adv-divider" />

                    {/* Bordes */}
                    <div className="panel-section">
                        <div className="section-label">Bordes / Guías</div>
                        <div className="select-buttons-grid">
                            <button className={gridBorders === 'NONE' ? 'active' : ''} onClick={() => setGridBorders('NONE')}>Sin bordes</button>
                            <button className={gridBorders === 'DASHED' ? 'active' : ''} onClick={() => setGridBorders('DASHED')}>Guías ✂️</button>
                            <button className={gridBorders === 'PHOTO' ? 'active' : ''} onClick={() => setGridBorders('PHOTO')}>Marco 🖼️</button>
                        </div>
                    </div>

                    <div className="adv-divider" />

                    {/* Textos en lote */}
                    <div className="panel-section">
                        <div className="section-label">Pies de Foto (todas)</div>
                        <div className="toggle-group">
                            <button onClick={() => toggleAllCaptions(true)}>📝 Activar</button>
                            <button onClick={() => toggleAllCaptions(false)}>❌ Ocultar</button>
                        </div>
                    </div>

                </div>
            )}

            {/* ─── ACCIONES ─── */}
            <div className="action-buttons">
                <button
                    className="clear-btn"
                    onClick={clearImages}
                    disabled={isDownloading || pages.length === 0}
                >🗑️ Limpiar Todo</button>
                <button
                    className="download-btn"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading || pages.length === 0}
                >
                    {isDownloading ? '⏳ Generando...' : '⬇️ Descargar PDF'}
                </button>
            </div>

        </div>
    );
};

export default ControlPanel;
