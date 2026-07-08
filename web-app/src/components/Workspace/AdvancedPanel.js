import React from 'react';
import { useApp } from '../../context/AppContext';
import './AdvancedPanel.css';

const AdvancedPanel = () => {
  const {
    grid, setGrid,
    marginSize, setMarginSize,
    gridBorders, setGridBorders,
    toggleAllCaptions,
    imageScale, setImageScale,
    imageFit, setImageFit,
    captionPosition, setCaptionPosition,
    pageBackground, setPageBackground,
    exportQuality, setExportQuality
  } = useApp();

  return (
    <div className="advanced-panel">
      <div className="advanced-panel-header">
        <h3 className="advanced-panel-title">Advanced</h3>
      </div>

      <div className="advanced-panel-body">
        <div className="adv-section">
          <div className="adv-section-label">Custom Grid</div>
          <div className="adv-grid-inputs">
            <div className="adv-input-group">
              <label>Cols</label>
              <input
                type="number" min="1" max="20"
                value={grid.cols}
                onChange={(e) => setGrid({ ...grid, cols: Number(e.target.value) })}
              />
            </div>
            <span className="adv-cross">×</span>
            <div className="adv-input-group">
              <label>Rows</label>
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
          <div className="adv-section-label">Image Scale</div>
          <div className="adv-scale-row">
            <span className="adv-scale-label">Tight</span>
            <input
              type="range"
              className="adv-scale-slider"
              min="0.4"
              max="0.95"
              step="0.05"
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
            />
            <span className="adv-scale-label">Spacious</span>
          </div>
          <div className="adv-scale-value">{Math.round(imageScale * 100)}%</div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">Image Fit</div>
          <div className="adv-toggle-row">
            <button
              className={`adv-toggle-btn ${imageFit === 'contain' ? 'active' : ''}`}
              onClick={() => setImageFit('contain')}
            >
              Contain
            </button>
            <button
              className={`adv-toggle-btn ${imageFit === 'cover' ? 'active' : ''}`}
              onClick={() => setImageFit('cover')}
            >
              Cover
            </button>
          </div>
          <div className="adv-hint">
            {imageFit === 'contain' ? 'Image fits entirely with spacing' : 'Image fills cell, may crop edges'}
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">Captions</div>
          <div className="adv-section-sub">
            <span className="adv-sub-label">Position</span>
            <div className="adv-toggle-row">
              <button
                className={`adv-toggle-btn ${captionPosition === 'below' ? 'active' : ''}`}
                onClick={() => setCaptionPosition('below')}
              >
                Below
              </button>
              <button
                className={`adv-toggle-btn ${captionPosition === 'above' ? 'active' : ''}`}
                onClick={() => setCaptionPosition('above')}
              >
                Above
              </button>
            </div>
          </div>
          <div className="adv-section-sub">
            <span className="adv-sub-label">Batch</span>
            <div className="adv-toggle-row">
              <button className="adv-action-btn" onClick={() => toggleAllCaptions(true)}>Enable</button>
              <button className="adv-action-btn" onClick={() => toggleAllCaptions(false)}>Disable</button>
            </div>
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">Margins</div>
          <div className="adv-option-grid">
            {[{ key: 'NONE', label: 'None' }, { key: 'THIN', label: 'Thin' }, { key: 'NORMAL', label: 'Normal' }, { key: 'WIDE', label: 'Wide' }].map((m) => (
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
          <div className="adv-section-label">Borders</div>
          <div className="adv-option-grid">
            {[
              { key: 'NONE', label: 'None' },
              { key: 'DASHED', label: 'Guides' },
              { key: 'PHOTO', label: 'Frame' }
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
          <div className="adv-section-label">Page Background</div>
          <div className="adv-option-grid">
            {[
              { key: 'white', label: 'White', color: '#ffffff' },
              { key: 'off-white', label: 'Off-white', color: '#fafafa' },
              { key: 'warm', label: 'Warm', color: '#fff8f0' }
            ].map((b) => (
              <button
                key={b.key}
                className={`adv-option-btn ${pageBackground === b.key ? 'active' : ''}`}
                onClick={() => setPageBackground(b.key)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <div className="adv-section-label">Export Quality</div>
          <div className="adv-toggle-row">
            <button
              className={`adv-toggle-btn ${exportQuality === 0.85 ? 'active' : ''}`}
              onClick={() => setExportQuality(0.85)}
            >
              Standard
            </button>
            <button
              className={`adv-toggle-btn ${exportQuality === 0.95 ? 'active' : ''}`}
              onClick={() => setExportQuality(0.95)}
            >
              High
            </button>
          </div>
          <div className="adv-hint">
            {exportQuality === 0.85 ? 'Smaller file (~40% smaller)' : 'Maximum quality, larger PDF'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPanel;
