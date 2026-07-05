import React, { useRef, useEffect, useState } from 'react';
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

  return (
    <div className="workspace" ref={editorRef}>
      <Toolbar />
      <div className="workspace-body">
        <MainLayout>
          <ImagesPanel />
          <div className="workspace-canvas">
            <PrintPreview currentPage={currentPage} />
            <PageNavigation
              currentPage={currentPage}
              totalPages={pages.length}
              onChange={setCurrentPage}
            />
          </div>
          {mode === 'ADVANCED' && <AdvancedPanel />}
        </MainLayout>
      </div>
    </div>
  );
};

export default Workspace;
