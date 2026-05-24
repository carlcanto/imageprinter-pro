# ImagePrinter Pro 🖼️🖨️

ImagePrinter Pro es una potente herramienta web (Single Page Application) diseñada para optimizar el proceso de imprimir y organizar múltiples fotos o imágenes. Olvídate de pelear con procesadores de texto y organizar fotos de a una; esta herramienta crea matrices exactas, auto-ajusta proporciones y exporta un documento PDF impecable listo para mandar a la impresora.

---

## ✨ Características Principales

- 📐 **Matrices Exactas**: No adivines el tamaño. Elige visualmente una cuadrícula (ej: `2x2`, `3x3`) o crea una propia (ej: `5x10`) y la aplicación acomodará las imágenes por ti matemáticamente.
- ✂️ **Recorte Dinámico Completo (Crop)**: Al pasar el cursor, presiona el botón de recortar para abrir un editor modal que te permitirá extraer la porción perfecta de cada foto.
- 📝 **Subtítulos con Formato Integrado**: Escribe pies de fotos bajo cada imagen con opciones completas para alinear el texto (Izquierda, Centro, Derecha) y aumentar/reducir la letra.
- 🔄 **Drag and Drop Activo**: Simplemente toma una foto con tu ratón y suéltala sobre otra para intercambiar sus lugares y reordenar tu collage visual rápidamente.
- 🗂️ **Listas para PDF**: Exportación súper limpia y ligera a documento `.pdf` sin interfaces basura y listo en un clic.
- ⚡ **100% Frontend**: Arquitectura puramente renderizada en el navegador. Rápida, privada y económica para alojamiento (Hosting de coste cero).

---

## 🚀 Cómo ejecutar el proyecto (Modo de Desarrollo)

Este proyecto está construido enteramente sobre React. No necesitas configurar bases de datos ni Docker. Iniciar todo tomará menos de dos minutos.

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/es/).

### Instalación Automática

1. **Clona o descarga el repositorio** en tu computadora.
2. **Abre la terminal** (o consola) en la carpeta del proyecto y muévete a la aplicación:
   ```bash
   cd web-app
   ```
3. **Instala las dependencias** esenciales del proyecto:
   ```bash
   npm install
   ```
4. **Enciende el servidor local**:
   ```bash
   npm start
   ```

Una pestaña se abrirá automáticamente en tu navegador apuntando a `http://localhost:3000`. ¡Y ya está, empieza a subir imágenes!

---

## 🛠 Tecnologías Utilizadas

- **[React](https://reactjs.org/)**: Motor gráfico y reactivo que maneja todos los estados.
- **[jsPDF](https://github.com/parallax/jsPDF)**: Para la generación y cálculo del documento y papel subyacente.
- **[html2canvas](https://html2canvas.hertzen.com/)**: Para "tomar una fotografía" de máxima calidad al render de React y encapsularlo.
- **[React Image Crop](https://github.com/DominicTobias/react-image-crop)**: Para las herramientas finas y superpuestas de recorte interno.

**¡Diseñado y mantenido para máxima productividad! 🚀**
