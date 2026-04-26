/**
 * Motor de Layout para ImagePrinter Pro
 * Calcula la distribución de imágenes en páginas basándose en un factor de densidad.
 */

// Dimensiones en mm (estándar para impresión)
const PAPER_SIZES = {
    A4: { width: 210, height: 297, name: 'A4' },
    LETTER: { width: 215.9, height: 279.4, name: 'Carta' } // 8.5 x 11 in
};

/**
 * Calcula el grid óptimo (columnas x filas) basado en la densidad.
 * @param {number} density - Valor de 0 a 200 (rango extendido para mayor precisión).
 *   0 = 1 imagen grande (1x1)
 *   100 = ~6 imágenes (2x3)
 *   200 = ~30 imágenes
 */
const calculateGrid = (density) => {
    // Mapeo más granular para slider extendido
    if (density < 10) return { cols: 1, rows: 1 };   // 1 img
    if (density < 25) return { cols: 1, rows: 2 };   // 2 imgs
    if (density < 40) return { cols: 2, rows: 2 };   // 4 imgs
    if (density < 55) return { cols: 2, rows: 3 };   // 6 imgs
    if (density < 70) return { cols: 3, rows: 3 };   // 9 imgs
    if (density < 90) return { cols: 3, rows: 4 };   // 12 imgs
    if (density < 110) return { cols: 4, rows: 4 };  // 16 imgs
    if (density < 130) return { cols: 4, rows: 5 };  // 20 imgs
    if (density < 150) return { cols: 5, rows: 5 };  // 25 imgs
    if (density < 175) return { cols: 5, rows: 6 };  // 30 imgs
    return { cols: 6, rows: 6 };                     // 36 imgs (max)
};


/**
 * Función principal que toma imágenes y configuración, y devuelve páginas estructuradas.
 * 
 * @param {Array} images - Array de objetos { id, src, width, height, aspect }
 * @param {string} paperSizeKey - 'A4' | 'LETTER'
 * @param {number} density - 0 to 100
 * @returns {Array} Array de páginas, donde cada página tiene un array de items posicionados.
 */
export const calculateLayout = (images, paperSizeKey = 'A4', density = 50) => {
    const paper = PAPER_SIZES[paperSizeKey] || PAPER_SIZES.A4;
    const { cols, rows } = calculateGrid(density);
    const itemsPerPage = cols * rows;

    // Márgenes seguros para impresión (en mm)
    const margin = 10;
    const contentWidth = paper.width - (margin * 2);
    const contentHeight = paper.height - (margin * 2);

    // Tamaño de celda
    const cellWidth = contentWidth / cols;
    const cellHeight = contentHeight / rows;

    // Agrupar imágenes en páginas
    const pages = [];
    for (let i = 0; i < images.length; i += itemsPerPage) {
        const pageImages = images.slice(i, i + itemsPerPage);

        const items = pageImages.map((img, index) => {
            // Calcular posición en grid
            const col = index % cols;
            const row = Math.floor(index / cols);

            let x = margin + (col * cellWidth);
            let y = margin + (row * cellHeight);

            // Ajustar imagen para que quepa en la celda manteniendo aspect ratio (Contain)
            // La celda es el bounding box máximo

            let finalWidth, finalHeight;
            const cellAspect = cellWidth / cellHeight;
            const imgAspect = img.aspect || 1; // fallback

            if (imgAspect > cellAspect) {
                // Imagen más ancha que la celda -> Ajustar al ancho
                finalWidth = cellWidth * 0.95; // 5% padding interno
                finalHeight = finalWidth / imgAspect;
            } else {
                // Imagen más alta que la celda -> Ajustar al alto
                finalHeight = cellHeight * 0.95;
                finalWidth = finalHeight * imgAspect;
            }

            // Centrar en celda
            const cellCenterX = x + (cellWidth / 2);
            const cellCenterY = y + (cellHeight / 2);

            return {
                ...img,
                x: cellCenterX - (finalWidth / 2),
                y: cellCenterY - (finalHeight / 2),
                width: finalWidth,
                height: finalHeight,
                pageIndex: pages.length
            };
        });

        pages.push({
            id: `page-${pages.length}`,
            items,
            width: paper.width,
            height: paper.height
        });
    }

    return pages;
};

export const PRESETS = {
    BIG: 0,     // 1 por hoja
    MEDIUM: 70, // ~9 por hoja
    SMALL: 150  // ~25 por hoja
};
