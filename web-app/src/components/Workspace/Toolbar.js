import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PRESETS } from '../../core/layoutEngine';
import './Toolbar.css';

const Toolbar = () => {
  const {
    addImages, pages,
    paperSize, setPaperSize,
    mode, setMode,
    setSimplePreset, setGlobalOrientation, defaultOrientation,
    grid
  } = useApp();

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

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const isGridEqual = (g1, g2) => g1.cols === g2.cols && g1.rows === g2.rows;
  const currentPresetIndex = PRESETS.findIndex(p => isGridEqual(p, grid));

  const handleGridChange = (e) => {
    const index = parseInt(e.target.value, 10);
    if (index >= 0 && index < PRESETS.length) {
      setSimplePreset(PRESETS[index]);
      setMode('SIMPLE');
    }
  };

  const handleDownloadPDF = async () => {
    if (pages.length === 0) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const pageElements = document.querySelectorAll('.print-page');
    const isA4 = paperSize === 'A4';
    const pdfWidthBase = isA4 ? 210 : 215.9;
    const pdfHeightBase = isA4 ? 297 : 279.4;
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
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn toolbar-btn-primary" onClick={handleUpload}>
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      <div className="toolbar-center">
        <div className="toolbar-group">
          <label className="toolbar-label">Grid</label>
          <select
            className="toolbar-select"
            value={currentPresetIndex >= 0 ? currentPresetIndex : -1}
            onChange={handleGridChange}
          >
            {PRESETS.map((p, i) => (
              <option key={i} value={i}>{p.cols}×{p.rows}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <label className="toolbar-label">Orientation</label>
          <div className="toolbar-toggle-row">
            <button
              className={`toolbar-toggle-btn ${defaultOrientation === 'PORTRAIT' ? 'active' : ''}`}
              onClick={() => setGlobalOrientation('PORTRAIT')}
            >
              Portrait
            </button>
            <button
              className={`toolbar-toggle-btn ${defaultOrientation === 'LANDSCAPE' ? 'active' : ''}`}
              onClick={() => setGlobalOrientation('LANDSCAPE')}
            >
              Landscape
            </button>
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <label className="toolbar-label">Paper</label>
          <div className="toolbar-toggle-row">
            <button
              className={`toolbar-toggle-btn ${paperSize === 'A4' ? 'active' : ''}`}
              onClick={() => setPaperSize('A4')}
            >
              A4
            </button>
            <button
              className={`toolbar-toggle-btn ${paperSize === 'LETTER' ? 'active' : ''}`}
              onClick={() => setPaperSize('LETTER')}
            >
              Letter
            </button>
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            className={`toolbar-adv-toggle ${mode === 'ADVANCED' ? 'active' : ''}`}
            onClick={() => setMode(mode === 'ADVANCED' ? 'SIMPLE' : 'ADVANCED')}
          >
            Advanced
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        <button className="toolbar-btn toolbar-btn-download" onClick={handleDownloadPDF}>
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
