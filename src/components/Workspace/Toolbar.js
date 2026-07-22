import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import useTranslation from '../../hooks/useTranslation';
import { PRESETS } from '../../core/layoutEngine';
import './Toolbar.css';

const GridPreview = ({ cols, rows }) => (
  <div className="grid-option-preview" style={{ '--cols': cols, '--rows': rows }}>
    {Array.from({ length: cols * rows }).map((_, j) => (
      <span key={j} className="grid-cell" />
    ))}
  </div>
);

const Toolbar = ({ zoom, setZoom, onFit }) => {
  const {
    addImages, pages,
    paperSize, setPaperSize,
    mode, setMode,
    setSimplePreset, setGlobalOrientation, defaultOrientation,
    grid, exportQuality,
    theme, setTheme,
    language, setLanguage
  } = useApp();
  const { t } = useTranslation();

  const [isDownloading, setIsDownloading] = useState(false);
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

  const handleUpload = () => fileInputRef.current.click();

  const isGridEqual = (g1, g2) => g1.cols === g2.cols && g1.rows === g2.rows;

  const handleDownloadPDF = async () => {
    if (pages.length === 0) return;
    setIsDownloading(true);
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const allPages = document.querySelectorAll('.print-page');
    allPages.forEach(p => p.classList.add('pdf-export-visible'));
    await new Promise(r => setTimeout(r, 50));

    const isA4 = paperSize === 'A4';
    const pdfWidthBase = isA4 ? 210 : 215.9;
    const pdfHeightBase = isA4 ? 297 : 279.4;
    const firstPageIsLandscape = pages[0]?.orientation === 'LANDSCAPE';
    const pdf = new jsPDF({
      orientation: firstPageIsLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: isA4 ? 'a4' : 'letter'
    });

    for (let i = 0; i < allPages.length; i++) {
      allPages[i].classList.add('html2canvas-exporting');
      const canvas = await html2canvas(allPages[i], { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      allPages[i].classList.remove('html2canvas-exporting');
      const imgData = canvas.toDataURL('image/jpeg', exportQuality);
      const isPageLandscape = pages[i]?.orientation === 'LANDSCAPE';
      const currentWidth = isPageLandscape ? pdfHeightBase : pdfWidthBase;
      const currentHeight = isPageLandscape ? pdfWidthBase : pdfHeightBase;
      if (i > 0) pdf.addPage(isA4 ? 'a4' : 'letter', isPageLandscape ? 'landscape' : 'portrait');
      pdf.addImage(imgData, 'JPEG', 0, 0, currentWidth, currentHeight);
    }

    allPages.forEach(p => p.classList.remove('pdf-export-visible'));
    pdf.save(`imagenes-${new Date().toISOString().slice(0, 10)}.pdf`);
    setIsDownloading(false);
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn toolbar-btn-primary" onClick={handleUpload}>
          {t('toolbar.upload')}
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
        <div className="toolbar-group toolbar-group-grid">
          <label className="toolbar-label">{t('toolbar.layout')}</label>
          <div className="grid-preset-row">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                className={`grid-preset-btn ${isGridEqual(p, grid) && mode === 'SIMPLE' ? 'active' : ''}`}
                onClick={() => { setSimplePreset(p); setMode('SIMPLE'); }}
                title={`${p.cols}×${p.rows}`}
              >
                <GridPreview cols={p.cols} rows={p.rows} />
                <span className="grid-preset-label">{p.cols}×{p.rows}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <label className="toolbar-label">{t('toolbar.orientation')}</label>
          <div className="toolbar-toggle-row">
            <button
              className={`toolbar-toggle-btn ${defaultOrientation === 'PORTRAIT' ? 'active' : ''}`}
              onClick={() => setGlobalOrientation('PORTRAIT')}
            >
              {t('toolbar.portrait')}
            </button>
            <button
              className={`toolbar-toggle-btn ${defaultOrientation === 'LANDSCAPE' ? 'active' : ''}`}
              onClick={() => setGlobalOrientation('LANDSCAPE')}
            >
              {t('toolbar.landscape')}
            </button>
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <label className="toolbar-label">{t('toolbar.paper')}</label>
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
            {t('toolbar.advanced')}
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group toolbar-zoom">
          <button className="toolbar-zoom-btn" onClick={() => setZoom(Math.max(0.25, zoom - 0.1))} title="Zoom Out">−</button>
          <span className="toolbar-zoom-level">{zoomPercent}%</span>
          <button className="toolbar-zoom-btn" onClick={() => setZoom(Math.min(3, zoom + 0.1))} title="Zoom In">+</button>
          <button className="toolbar-zoom-fit" onClick={onFit} title="Fit to Page">{t('toolbar.zoom_fit')}</button>
        </div>
      </div>

      <div className="toolbar-right">
        <button className="toolbar-btn toolbar-theme-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="toolbar-btn toolbar-lang-btn" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}>
          {language === 'es' ? 'EN' : 'ES'}
        </button>
        <button className="toolbar-btn toolbar-btn-download" onClick={handleDownloadPDF} disabled={isDownloading}>
          {isDownloading ? t('toolbar.exporting') : t('toolbar.export')}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
