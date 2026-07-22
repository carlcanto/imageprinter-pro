import React, { useRef, useEffect, useState, useCallback } from 'react';
import Toolbar from './Toolbar';
import MainLayout from '../Layout/MainLayout';
import ImagesPanel from './ImagesPanel';
import PrintPreview from '../Preview/PrintPreview';
import AdvancedPanel from './AdvancedPanel';
import PageNavigation from './PageNavigation';
import { useApp } from '../../context/AppContext';
import './Workspace.css';

const Workspace = () => {
  const { pages, mode } = useApp();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const canvasAreaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (currentPage >= pages.length) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

  const calcFit = useCallback(() => {
    const area = canvasAreaRef.current;
    const visiblePage = document.querySelector('.page-visible');
    if (!area || !visiblePage) return;
    const areaW = area.clientWidth;
    const areaH = area.clientHeight;
    const pageW = visiblePage.scrollWidth;
    const pageH = visiblePage.scrollHeight;
    if (pageW === 0 || pageH === 0) return;
    const fit = Math.min((areaW - 40) / pageW, (areaH - 60) / pageH, 1);
    setZoom(Math.round(fit * 100) / 100);
  }, []);

  useEffect(() => {
    if (pages.length === 0) return;
    requestAnimationFrame(() => requestAnimationFrame(calcFit));
  }, [pages.length, calcFit]);

  return (
    <div className="workspace" ref={editorRef}>
      <Toolbar zoom={zoom} setZoom={setZoom} onFit={calcFit} />
      <div className="workspace-body">
        <MainLayout>
          <ImagesPanel />
          <div className="workspace-canvas" ref={canvasAreaRef}>
            <PrintPreview zoom={zoom} currentPage={currentPage} />
            <PageNavigation
              currentPage={currentPage}
              totalPages={pages.length}
              onChange={setCurrentPage}
            />
          </div>
          <div className="workspace-right-panel">
            {mode === 'ADVANCED' && <AdvancedPanel />}
          </div>
        </MainLayout>
      </div>
    </div>
  );
};

export default Workspace;
