import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './components/Landing/Landing';
import Workspace from './components/Workspace/Workspace';
import './styles/global.css';

function AppContent() {
  const { pages } = useApp();

  if (pages.length === 0) {
    return <Landing />;
  }

  return <Workspace />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
