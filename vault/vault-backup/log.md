---
title: Log de Operaciones
updated: 2026-07-03
---

## 2026-07-03 · Inicialización del sistema

- Creada estructura completa del vault en `imageprinter-pro/vault/`
- Commit `93be213` marcado como estable en ACTIVE_CONTEXT.md
- PROJECT_MAP.md poblado con stack, estructura, flujo y branches
- Merge `preprod → main` completado con tema azul marino + vercel.json
- Vercel MCP autenticado en opencode

## 2026-07-03 · Nuevo diseño premium + Tailwind

- **Commit**: `f27f3b3`
- Agregado Tailwind CSS + CRACO + lucide-react
- Nuevo split layout: hero (52%) + app preview (48%)
- Fondo contextual: `fondo.png` con grayscale+blur+overlay
- Componentes: Navigation, HeroSection, StatsBar, FeaturePills, AppPreview, Toolbar, FloatingWidgets, TrustBar
- Tipografía: Poppins + Source Serif 4
- Sistema de color: escala de grises (HSL)
- Efecto Liquid Glass con `@layer components`
- PrintPreview funcional integrado dentro del nuevo contenedor glass
- Eliminados componentes viejos: MainLayout, ControlPanel, DropZone

## 2026-07-04 · Fix pipeline CSS

- **Commit**: `0b75017`
- Separado `postcss.config.js` de `craco.config.js` (CRACO v7 requiere config separada)
- Movido `@layer components` y reset a `index.css` en orden correcto
- Eliminado `@import` de `global.css` que rompía el procesamiento de Tailwind
- Tailwind ahora genera todas las clases correctamente en el build

## 2026-07-04 · Refactor: UI funcional + diseño visual

- **Commit**: `a05731f`
- Eliminados componentes de landing page (Hero, AppPreview, Widgets, TrustBar)
- Restaurados componentes funcionales: MainLayout, ControlPanel, DropZone, PrintPreview
- MainLayout actualizado con: fondo contextual, nav glass, GitHub button
- ControlPanel restyle: liquid-glass, grayscale, toggle groups
- DropZone restyle: glass drop zone con icono
- PrintPreview CSS actualizado a grayscale
- Build correcto con Tailwind + liquid-glass funcionales
