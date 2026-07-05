import React from 'react';
import { useApp } from '../../context/AppContext';
import './ImagesPanel.css';

const ImagesPanel = () => {
  const { images, removeImage } = useApp();

  return (
    <div className="images-panel">
      <div className="images-panel-header">
        <h3 className="images-panel-title">Images</h3>
        <span className="images-panel-count">{images.length}</span>
      </div>
      <div className="images-panel-list">
        {images.map((img) => (
          <div key={img.id} className="images-panel-item">
            <label className="images-panel-check-label">
              <input
                type="checkbox"
                className="images-panel-check"
                checked={true}
                onChange={() => removeImage(img.id)}
              />
              <div className="images-panel-thumb">
                <img src={img.croppedSrc || img.src} alt="" />
              </div>
              <span className="images-panel-name">
                {img.file?.name || `Image ${img.id.slice(0, 6)}`}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesPanel;
