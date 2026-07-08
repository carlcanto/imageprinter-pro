# ImagePrinter Pro — Design System

## Brand Essence

Herramienta rápida y minimalista para convertir fotos en PDFs imprimibles.
Sin distracciones. Sin marketing. Sin configuraciones innecesarias.
La interfaz debe sentirse como una extensión natural del flujo de trabajo.

---

## Typography

| Uso | Fuente | Peso | Tamaño base |
|---|---|---|---|
| UI general (títulos, labels, botones) | `Plus Jakarta Sans` | 500, 600, 700 | 0.7rem–1.1rem |
| Texto secundario / hints | `Plus Jakarta Sans` | 400 | 0.65rem–0.8rem |
| Captions / pies de foto (impresión) | `Georgia, "Times New Roman", serif` | — | 14px (ajustable) |

Import:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

---

## Color Palette

### Dark Mode (default)

| Token | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#0B1121` | Fondo principal (más profundo que slate 900) |
| `--bg-secondary` | `#182235` | Superficies elevadas (paneles, sidebars) |
| `--bg-elevated` | `#1E2A3F` | Hover states, tarjetas interactivas |
| `--bg-glass` | `rgba(24, 34, 53, 0.8)` | Efectos glassmorphism |
| `--text-primary` | `#F1F5F9` | Texto principal |
| `--text-secondary` | `#94A3B8` | Labels, descripciones |
| `--text-tertiary` | `#64748B` | Hints, placeholders |
| `--accent` | `#7C3AED` | Violet — acción principal, active states |
| `--accent-hover` | `#6D28D9` | Hover del accent |
| `--accent-glow` | `rgba(124, 58, 237, 0.25)` | Sombra brillante en botones CTA |
| `--accent-cyan` | `#06B6D4` | Cyan — export/acciones secundarias |
| `--accent-cyan-hover` | `#0891B2` | Hover del cyan |
| `--color-success` | `#10B981` | Verde — éxito |
| `--color-danger` | `#EF4444` | Rojo — eliminar, destructive |
| `--border` | `rgba(255, 255, 255, 0.06)` | Bordes generales |
| `--border-hover` | `rgba(255, 255, 255, 0.12)` | Bordes en hover |

### Modifier: `--accent` es VENDAVAL. No mezclar con otros colores azules.
### `--accent-cyan` solo para Export y acciones de descarga. No reusar para selects.

---

## Spacing

Escala basada en múltiplos de 4px (rem):

| Variable | Valor | Uso |
|---|---|---|
| `--space-1` | `0.25rem` (4px) | Gaps mínimos, iconos |
| `--space-2` | `0.5rem` (8px) | Padding interno compacto |
| `--space-3` | `0.75rem` (12px) | Padding estándar |
| `--space-4` | `1rem` (16px) | Secciones, gaps entre grupos |
| `--space-6` | `1.5rem` (24px) | Secciones grandes |
| `--space-8` | `2rem` (32px) | Landing, márgenes externos |

---

## Border Radius

| Variable | Valor | Uso |
|---|---|---|
| `--radius-sm` | `0.375rem` (6px) | Botones pequeños, inputs |
| `--radius-md` | `0.5rem` (8px) | Toggles, badges |
| `--radius-lg` | `0.75rem` (12px) | Paneles, cards |
| `--radius-xl` | `1rem` (16px) | Modales, contenedores grandes |

---

## Shadows & Elevation

| Variable | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Botones, inputs |
| `--shadow-md` | `0 4px 8px rgba(0,0,0,0.25)` | Paneles, toolbars |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.35)` | Modales, dropdowns |
| `--shadow-glow` | `0 0 20px var(--accent-glow)` | Botón CTA primario |

---

## Animation

| Variable | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Micro-interacciones |
| `--duration-fast` | `150ms` | Hover, focus |
| `--duration-normal` | `250ms` | Transiciones de panel, página |
| `--duration-slow` | `400ms` | Page navigation, modales |

Reglas:
- Hover: scale 0.97 → 1.0 en botones (con translateZ(0) para GPU)
- Page transition: slide horizontal (← →) con 250ms
- Export loading: spinner animado (rotación CSS)
- Focus: ring de 2px con `--accent` y offset 2px

---

## Iconography

Librería: **Lucide React** (`lucide-react`)

| Contexto | Tamaño | Stroke |
|---|---|---|
| Toolbar / botones | 18px | 1.5px |
| Panel items | 16px | 2px |
| Landing steps | 28px | 1.5px |
| Item toolbar | 14px | 1.5px |

Regla: NO usar emojis como iconos estructurales.

---

## Component Patterns

### Toolbar
- Fondo: `--bg-glass` con backdrop-blur
- Sombra: `--shadow-md` hacia abajo
- Separadores: línea vertical `1px solid var(--border)`

### Panels (Images, Advanced)
- Fondo: `--bg-secondary`
- Borde derecho/izquierdo: `1px solid var(--border)`
- Header: borde inferior + label uppercase

### Print Page (canvas)
- Fondo: blanco (impresión)
- Sombra: `--shadow-lg` (en canvas)
- Page controls header: `--bg-elevated` con border-bottom sutil
- Hover item: toolbar flotante con glass effect

### Grid Presets
- Botones pequeños (28×28px) con preview visual del grid
- Active: fondo `--accent`, dots blancos
- Hover: border `--border-hover`

### Buttons
- Upload / primary: fondo `--accent`, glow en hover
- Export: fondo `--accent-cyan`, glow cyan
- Clear / danger: border `rgba(239,68,68,0.3)`, texto `--color-danger`
- Toggle: grupo con fondo `--bg-secondary`, active `--accent`

---

## Export (PDF)

- High quality: `image/jpeg, 0.95` (~15MB por 20 páginas)
- Standard quality: `image/jpeg, 0.85` (~6MB)
- Fondo siempre blanco en el PDF
- Captions se renderizan con `Georgia, serif` en export

---

## Print

- `@page { size: auto; margin: 0; }`
- Ocultar toda la UI de edición (toolbar, panels, navigation, item toolbars)
- Captions: ocultar `.caption-input`, mostrar `.caption-display-print`
- `color-scheme: light` para evitar problemas de contraste

---

## Checklist visual (pre-deploy)

- [ ] No emojis como iconos (usar Lucide)
- [ ] cursor-pointer en todo lo clickeable
- [ ] Hover states con transición suave (150ms, ease-out)
- [ ] Focus rings visibles para navegación por teclado
- [ ] Touch targets ≥ 44px
- [ ] prefers-reduced-motion: desactivar animaciones
- [ ] Responsive: 375px, 768px, 1024px, 1440px
