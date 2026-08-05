import React from 'react';
import { Images, Settings } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
import './MobileBar.css';

const MobileBar = ({ onImages, onAdvanced, active }) => {
  const { t } = useTranslation();

  return (
    <div className="mobile-bar">
      <button
        className={`mobile-bar-btn ${active === 'images' ? 'active' : ''}`}
        onClick={onImages}
      >
        <Images size={20} strokeWidth={1.5} />
        <span>{t('images.title')}</span>
      </button>
      <button
        className={`mobile-bar-btn ${active === 'advanced' ? 'active' : ''}`}
        onClick={onAdvanced}
      >
        <Settings size={20} strokeWidth={1.5} />
        <span>{t('advanced.title')}</span>
      </button>
    </div>
  );
};

export default MobileBar;
