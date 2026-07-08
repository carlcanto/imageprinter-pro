---
title: Log de Operaciones
updated: 2026-07-06
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

## 2026-07-06 · Instalación de herramientas complementarias

- **claude-mem v13.10.2**: Sistema de memoria persistente automática instalado (`npx claude-mem install --ide opencode`)
  - Plugin registrado en marketplace de Claude Code
  - OpenCode plugin generado en `dist/opencode-plugin/`
  - Worker service (Bun) en puerto 37777 — se activa al iniciar sesión
  - Config en `~/.claude-mem/settings.json`
  - Dependencia npm: resuelta con `--legacy-peer-deps` por conflicto tree-sitter
- **claude-code-security-review**: GitHub Action creado en `.github/workflows/security.yml`
  - Escanea PRs con Claude API para detectar vulnerabilidades
  - Requiere `CLAUDE_API_KEY` como GitHub secret (pendiente configurar)
  - Filtrado de falsos positivos incluido

## 2026-07-06 · Instalación de gstack (Garry Tan) + inventario completo

- **gstack**: 55 skills instaladas en `~/.config/opencode/skills/gstack-*/`
  - Clonado de `https://github.com/garrytan/gstack` → `~/gstack`
  - Build: `bun install` + `bun run build` + `bunx playwright install chromium`
  - Skills generadas con `gen:skill-docs --host opencode`
  - 55 symlinks creados a `~/.config/opencode/skills/`
- **Inventario completo** guardado en `~/Documents/inventario-skills-plugins-opencode.txt` (428 líneas, 34KB)
  - 113 skills totales documentadas
  - 7 skills redundantes identificadas (reemplazadas por gstack)
  - 8 gstack skills no aplican a este proyecto (iOS, GBrain)

## 2026-07-07 · Limpieza del ecosistema + instalación de speckit y ui-ux-pro-max

- **Eliminadas 20 skills**:
  - Grupo A (duplicados): careful, freeze, qa-only, context-save, context-restore, squirrel, tdd
  - Grupo B (iOS): ios-qa, ios-fix, ios-design-review, ios-clean, ios-sync
  - Grupo C (GBrain): setup-gbrain, sync-gbrain
  - Grupo D (stubs): how-it-works, what-the, wowerpoint, docs
  - Grupo E (reemplazadas): gstack-spec, make-plan/Claude-Mem
- **Instalado speckit v0.12.6.dev0** — 10 comandos en `~/.config/opencode/.opencode/commands/`:
  - speckit.constitution, speckit.specify, speckit.plan, speckit.tasks, speckit.implement
  - speckit.clarify, speckit.analyze, speckit.checklist, speckit.converge, speckit.taskstoissues
  - Pipeline completo: Spec → Plan → Tasks → Implement → Converge
- **Instalado ui-ux-pro-max** — 1 skill en `~/.opencode/skills/ui-ux-pro-max/`
  - 161 reglas de razonamiento, 67 estilos UI, 161 paletas de color, 57 font pairings
  - Soporte para 22 stacks (React, Next.js, Vue, Svelte, SwiftUI, etc.)
- **Estado final**: 79 skills + 10 comandos speckit (reducción de 115 → 89)
