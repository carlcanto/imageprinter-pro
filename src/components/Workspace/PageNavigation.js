import React, { useEffect } from 'react';
import useTranslation from '../../hooks/useTranslation';
import './PageNavigation.css';

const PageNavigation = ({ currentPage, totalPages, onChange }) => {
  const { t } = useTranslation();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPage > 0) onChange(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentPage < totalPages - 1) onChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onChange]);

  if (totalPages === 0) return null;

  return (
    <div className="page-nav">
      <button
        className="page-nav-btn"
        disabled={currentPage <= 0}
        onClick={() => onChange(currentPage - 1)}
      >
        ←
      </button>
      <span className="page-nav-info">
        {t('page_nav.page')} {currentPage + 1} {t('page_nav.of')} {totalPages}
      </span>
      <button
        className="page-nav-btn"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onChange(currentPage + 1)}
      >
        →
      </button>
    </div>
  );
};

export default PageNavigation;
