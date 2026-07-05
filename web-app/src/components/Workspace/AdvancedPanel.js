import React from 'react';
import { useApp } from '../../context/AppContext';
import './AdvancedPanel.css';

const AdvancedPanel = () => {
  const {
    grid, setGrid,
    marginSize, setMarginSize,
    gridBorders, setGridBorders,
    toggleAllCaptions,
    clearImages
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
          <div className="adv-section-label">Margins</div>
          <div className="adv-option-grid">
            {['NONE', 'THIN', 'NORMAL', 'WIDE'].map((m) => (
              <button
                key={m}
                className={`adv-option-btn ${marginSize === m ? 'active' : ''}`}
                onClick={() => setMarginSize(m)}
              >
                {m === 'NONE' ? 'None' : m === 'THIN' ? 'Thin' : m === 'NORMAL' ? 'Normal' : 'Wide'}
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
              { key: 'DASHED', label: 'Guides ✂️' },
              { key: 'PHOTO', label: 'Frame 🖼️' }
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
          <div className="adv-section-label">Captions (batch)</div>
          <div className="adv-caption-row">
            <button className="adv-action-btn" onClick={() => toggleAllCaptions(true)}>
              Enable
            </button>
            <button className="adv-action-btn" onClick={() => toggleAllCaptions(false)}>
              Disable
            </button>
          </div>
        </div>

        <div className="adv-divider" />

        <div className="adv-section">
          <button className="adv-clear-btn" onClick={clearImages}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPanel;
