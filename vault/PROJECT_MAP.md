---
title: Mapa del Proyecto
updated: 2026-07-03
---

## Repositorio

| Nombre | Propósito | Estado |
|--------|-----------|--------|
| `imageprinter-pro` | App web para maquetar fotos en PDF | Producción (Vercel) |

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 (CRA) |
| PDF | html2canvas + jsPDF |
| Layout | `layoutEngine.js` (motor propio) |
| Estado | React Context + IndexedDB |
| Estilos | CSS custom properties |
| Deploy | Vercel (auto desde main) |

## Estructura

```
imageprinter-pro/
├── web-app/
│   ├── src/
│   │   ├── core/layoutEngine.js
│   │   ├── context/AppContext.js
│   │   ├── components/
│   │   │   ├── Upload/DropZone.js
│   │   │   ├── Controls/ControlPanel.js
│   │   │   ├── Preview/PrintPreview.js
│   │   │   └── Layout/MainLayout.js
│   │   ├── services/db.js
│   │   └── styles/
│   ├── public/
│   └── package.json
├── vault/ (sistema de memoria)
└── AGENTS.md
```

## Flujo principal

Upload → store en Context → calculateLayout → PrintPreview → html2canvas → jsPDF

## Estrategia de branches

- `main` → producción (deploy automático Vercel)
- `preprod` → pre-producción (Preview en Vercel)
- `lab` → desarrollo experimental

## Servicios externos

- Vercel (hosting + deploy)
- GitHub (código fuente)
