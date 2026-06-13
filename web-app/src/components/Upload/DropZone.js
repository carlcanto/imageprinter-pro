import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
// Fallback simple id generation if needed, or use Date.now()
import './DropZone.css'; // Crearemos este archivo CSS inline o separado

const DropZone = () => {
    const { addImages } = useApp();
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFiles = (files) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    addImages([{
                        id: Date.now() + Math.random().toString(), // Simple ID
                        src: img.src,
                        file: file,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        aspect: img.naturalWidth / img.naturalHeight
                    }]);
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    return (
        <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => processFiles(e.target.files)}
            />
            <div className="drop-content">
                <span className="icon">⊞</span>
                <p>Arrastra imágenes aquí o haz clic para subir</p>
                <small>JPG · PNG · WEBP</small>
            </div>
        </div>
    );
};

export default DropZone;
