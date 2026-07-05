import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import './Landing.css';

const Landing = () => {
  const { addImages } = useApp();
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

  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden="true">
        <div className="bg-page bg-page-1" />
        <div className="bg-page bg-page-2" />
        <div className="bg-page bg-page-3" />
        <div className="bg-page bg-page-4" />
        <div className="bg-page bg-page-5" />
      </div>

      <header className="landing-header">
        <div className="landing-header-left">
          <span className="landing-logo-icon">🖼️</span>
          <h1 className="landing-logo-text">ImagePrinter <span className="landing-pro-badge">PRO</span></h1>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="landing-github-btn"
        >
          GitHub
        </a>
      </header>

      <main className="landing-main">
        <h2 className="landing-title">Create printable photo layouts in seconds.</h2>

        <button className="landing-upload-btn" onClick={handleUpload}>
          Choose Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="landing-steps">
          <div className="landing-step">
            <div className="step-icon">📤</div>
            <div className="step-label">Upload</div>
            <div className="step-desc">Select your images</div>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="step-icon">📐</div>
            <div className="step-label">Arrange</div>
            <div className="step-desc">Choose a grid layout</div>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="step-icon">📄</div>
            <div className="step-label">Export PDF</div>
            <div className="step-desc">Download your print</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
