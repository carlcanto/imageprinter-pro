import React from 'react';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <header className="layout-header glass-panel">
                <div className="logo">
                    <span className="logo-mark">IP</span>
                    <div className="logo-text">
                        <h1>ImagePrinter <span className="pro-badge">PRO</span></h1>
                        <span className="logo-tagline">Taller de impresión digital</span>
                    </div>
                </div>
            </header>
            <main className="layout-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
