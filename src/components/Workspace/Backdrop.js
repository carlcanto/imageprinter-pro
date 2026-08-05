import React from 'react';
import './Backdrop.css';

const Backdrop = ({ open, onClose }) => {
  if (!open) return null;
  return <div className="mobile-backdrop" onClick={onClose} />;
};

export default Backdrop;
