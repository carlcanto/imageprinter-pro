import React from 'react';
import { useApp } from '../../context/AppContext';
import useTranslation from '../../hooks/useTranslation';
import './AdvancedPanel.css';

const AdvancedPanel = () => {
  const { t } = useTranslation();
  const {
    grid, setGrid,
    marginSize, setMarginSize,
    gridBorders, setGridBorders,
    toggleAllCaptions,
    imageScale, setImageScale,
    captionPosition, setCaptionPosition,
    exportQuality, setExportQuality
  } = useApp();

  return (
    <div className="advanced-panel">
      <div className="advanced-panel-header">
        <h3 className="advanced-panel-title">{t('advanced.title')}</h3>
      </div>

      <div className="advanced-panel-body">
        <div className="adv-section">
          <div className="adv-section-label">{t('advanced.custom_grid')}</div>
          <div className="adv-grid-inputs">
            <div className="adv-input-group">
              <label>{t('advanced.cols')}</label>
              <input
                type="number" min="1" max="20"
                value={grid.cols}
                onChange={(e) => setGrid({ ...grid, cols: Number(e.target.value) })}
              />
            </div>
            <span className="adv-cross">×</span>
            <div className="adv-input-group">
              <label>{t('advanced.rows')}</label>
              <input
                type="number" min="1" max="20"
                value={grid.rows}
                onChange={(e) => setGrid({ ...grid, rows: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">{t('advanced.image_scale')}</div>
          <div className="adv-scale-row">
            <span className="adv-scale-label">{t('advanced.mini')}</span>
            <input
              type="range"
              className="adv-scale-slider"
              min="0.2"
              max="2.0"
              step="0.05"
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
            />
            <span className="adv-scale-label">{t('advanced.large')}</span>
          </div>
          <div className="adv-scale-value">{Math.round(imageScale * 100)}%</div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">{t('advanced.captions')}</div>
          <div className="adv-section-sub">
            <span className="adv-sub-label">{t('advanced.position')}</span>
            <div className="adv-toggle-row">
              <button
                className={`adv-toggle-btn ${captionPosition === 'below' ? 'active' : ''}`}
                onClick={() => setCaptionPosition('below')}
              >
                {t('advanced.below')}
              </button>
              <button
                className={`adv-toggle-btn ${captionPosition === 'above' ? 'active' : ''}`}
                onClick={() => setCaptionPosition('above')}
              >
                {t('advanced.above')}
              </button>
            </div>
          </div>
          <div className="adv-section-sub">
            <span className="adv-sub-label">{t('advanced.batch')}</span>
            <div className="adv-toggle-row">
              <button className="adv-action-btn" onClick={() => toggleAllCaptions(true)}>{t('advanced.enable')}</button>
              <button className="adv-action-btn" onClick={() => toggleAllCaptions(false)}>{t('advanced.disable')}</button>
            </div>
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">{t('advanced.margins')}</div>
          <div className="adv-option-grid">
            {[{ key: 'NONE', label: t('advanced.none') }, { key: 'THIN', label: t('advanced.thin') }, { key: 'NORMAL', label: t('advanced.normal') }, { key: 'WIDE', label: t('advanced.wide') }].map((m) => (
              <button
                key={m.key}
                className={`adv-option-btn ${marginSize === m.key ? 'active' : ''}`}
                onClick={() => setMarginSize(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">{t('advanced.borders')}</div>
          <div className="adv-option-grid">
            {[
              { key: 'NONE', label: t('advanced.none') },
              { key: 'DASHED', label: t('advanced.guides') },
              { key: 'PHOTO', label: t('advanced.frame') }
            ].map((b) => (
              <button
                key={b.key}
                className={`adv-option-btn ${gridBorders === b.key ? 'active' : ''}`}
                onClick={() => setGridBorders(b.key)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">{t('advanced.export_quality')}</div>
          <div className="adv-toggle-row">
            <button
              className={`adv-toggle-btn ${exportQuality === 0.85 ? 'active' : ''}`}
              onClick={() => setExportQuality(0.85)}
            >
              {t('advanced.standard')}
            </button>
            <button
              className={`adv-toggle-btn ${exportQuality === 0.95 ? 'active' : ''}`}
              onClick={() => setExportQuality(0.95)}
            >
              {t('advanced.high')}
            </button>
          </div>
          <div className="adv-hint">
            {exportQuality === 0.85 ? t('advanced.standard_hint') : t('advanced.high_hint')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPanel;
