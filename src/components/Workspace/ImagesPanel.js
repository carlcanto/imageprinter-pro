import React from 'react';
import { useApp } from '../../context/AppContext';
import useTranslation from '../../hooks/useTranslation';
import './ImagesPanel.css';

const ImagesPanel = () => {
  const { t } = useTranslation();
  const { images, toggleImageSelection, selectAllImages, deselectAllImages, clearImages } = useApp();

  const hasImages = images.length > 0;
  const selectedCount = images.filter(img => img.selected !== false).length;

  return (
    <div className="images-panel">
      <div className="images-panel-header">
        <h3 className="images-panel-title">{t('images.title')}</h3>
        <span className="images-panel-count">{images.length}</span>
      </div>

      {hasImages && (
        <div className="images-panel-actions">
          <button className="images-panel-action-btn" onClick={selectAllImages}>
            {t('images.select_all')}
          </button>
          <button className="images-panel-action-btn" onClick={deselectAllImages}>
            {t('images.deselect')}
          </button>
          <span className="images-panel-selected">{selectedCount} {t('images.selected')}</span>
        </div>
      )}

      <div className="images-panel-list">
        {images.map((img) => {
          const isSelected = img.selected !== false;
          return (
            <div key={img.id} className="images-panel-item">
              <label className="images-panel-check-label">
                <input
                  type="checkbox"
                  className="images-panel-check"
                  checked={isSelected}
                  onChange={() => toggleImageSelection(img.id)}
                />
                <div className="images-panel-thumb">
                  <img src={img.croppedSrc || img.src} alt="" />
                </div>
                <span className="images-panel-name">
                  {img.file?.name || `Image ${img.id.slice(0, 6)}`}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {hasImages && (
        <div className="images-panel-footer">
          <button className="images-panel-clear-btn" onClick={clearImages}>
            {t('images.clear_all')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagesPanel;
