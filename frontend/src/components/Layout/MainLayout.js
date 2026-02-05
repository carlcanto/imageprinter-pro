import React from 'react';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <header className="layout-header glass-panel">
                <div className="logo">
                    <span className="logo-icon">🖼️</span>
                    <h1>ImagePrinter <span className="pro-badge">PRO</span></h1>
                </div>
            </header>
            <main className="layout-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
