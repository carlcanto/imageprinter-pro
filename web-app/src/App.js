import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import DropZone from './components/Upload/DropZone';
import ControlPanel from './components/Controls/ControlPanel';
import PrintPreview from './components/Preview/PrintPreview';
import './styles/global.css';

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <div className="sidebar">
          <DropZone />
          <ControlPanel />
        </div>
        <div className="preview-area">
          <PrintPreview />
        </div>
      </MainLayout>
    </AppProvider>
  );
}

export default App;
