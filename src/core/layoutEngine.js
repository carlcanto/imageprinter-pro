/**
 * Motor de Layout para ImagePrinter Pro
 * Calcula la distribución de imágenes en páginas basándose en un grid explícito (filas y columnas).
 */

// Dimensiones en mm (estándar para impresión)
const PAPER_SIZES = {
    A4: { width: 210, height: 297, name: 'A4' },
    LETTER: { width: 215.9, height: 279.4, name: 'Carta' } // 8.5 x 11 in
};

const MARGIN_SIZES = {
    NONE: 0,
    THIN: 5,
    NORMAL: 10,
    WIDE: 20
};

/**
 * Función principal que toma imágenes y configuración, y devuelve páginas estructuradas.
 * 
 * @param {Array} images - Array de objetos { id, src, width, height, aspect }
 * @param {string} paperSizeKey - 'A4' | 'LETTER'
 * @param {Object} grid - { cols, rows }
 * @param {Object} pageOrientations - { pageIndex: 'PORTRAIT' | 'LANDSCAPE' } - sobreescrituras por hoja
 * @param {string} marginSizeKey - 'NONE' | 'THIN' | 'NORMAL' | 'WIDE'
 * @param {string} defaultOrientation - 'PORTRAIT' | 'LANDSCAPE' - orientación base para todas las hojas
 * @returns {Array} Array de páginas, donde cada página tiene un array de items posicionados.
 */
export const calculateLayout = (
    images, 
    paperSizeKey = 'A4', 
    grid = { cols: 2, rows: 2 },
    pageOrientations = {},
    marginSizeKey = 'NORMAL',
    defaultOrientation = 'PORTRAIT',
    imageScale = 0.95
) => {
    const cols = grid.cols > 0 ? grid.cols : 1;
    const rows = grid.rows > 0 ? grid.rows : 1;
    const itemsPerPage = cols * rows;
    const margin = marginSizeKey in MARGIN_SIZES ? MARGIN_SIZES[marginSizeKey] : 10;

    // Agrupar imágenes en páginas
    const pages = [];
    for (let i = 0; i < images.length; i += itemsPerPage) {
        const pageIndex = pages.length;
        // Usar sobreescritura específica o caer al default global
        const pageOrientation = pageOrientations[pageIndex] !== undefined
            ? pageOrientations[pageIndex]
            : defaultOrientation;
        const isLandscape = pageOrientation === 'LANDSCAPE';

        const paperBase = PAPER_SIZES[paperSizeKey] || PAPER_SIZES.A4;
        const paper = isLandscape 
            ? { width: paperBase.height, height: paperBase.width } 
            : paperBase;

        const contentWidth = paper.width - (margin * 2);
        const contentHeight = paper.height - (margin * 2);

        // Tamaño de celda
        const cellWidth = contentWidth / cols;
        const cellHeight = contentHeight / rows;

        const pageImages = images.slice(i, i + itemsPerPage);

        const items = pageImages.map((img, index) => {
            // Calcular posición en grid
            const col = index % cols;
            const row = Math.floor(index / cols);

            let x = margin + (col * cellWidth);
            let y = margin + (row * cellHeight);

            // Ajustar imagen para que quepa en la celda manteniendo aspect ratio (Contain)
            let finalWidth, finalHeight;
            const cellAspect = cellWidth / cellHeight;
            const imgAspect = img.croppedAspect || img.aspect || 1; // fallback

            if (imgAspect > cellAspect) {
                // Imagen más ancha que la celda -> Ajustar al ancho
                finalWidth = cellWidth * imageScale;
                finalHeight = finalWidth / imgAspect;
            } else {
                // Imagen más alta que la celda -> Ajustar al alto
                finalHeight = cellHeight * imageScale;
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
                pageIndex
            };
        });

        pages.push({
            id: `page-${pageIndex}`,
            items,
            width: paper.width,
            height: paper.height,
            orientation: isLandscape ? 'LANDSCAPE' : 'PORTRAIT'
        });
    }

    return pages;
};

export const PRESETS = [
    { cols: 2, rows: 2 },
    { cols: 3, rows: 2 },
    { cols: 2, rows: 3 },
    { cols: 3, rows: 3 },
    { cols: 4, rows: 2 },
    { cols: 4, rows: 3 },
    { cols: 4, rows: 4 }
];
