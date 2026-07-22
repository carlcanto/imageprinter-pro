import React from 'react';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="workspace-layout">
      {children}
    </div>
  );
};

export default MainLayout;
