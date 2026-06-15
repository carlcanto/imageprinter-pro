# ImagePrinter Pro — AGENTS.md

## Estructura

- `web-app/` contiene la app React real (Create React App). El `package.json` raíz es un stub — trabajar siempre dentro de `web-app/`.
- Entrada real: `src/index.js` (React DOM render). `src/main.jsx` está vacío y no se usa.
- `src/pages/`, `src/store/`, `src/assets/` están vacíos. `src/services/db.js` tiene persistencia a IndexedDB.

## Ramas

| Rama | Uso |
|---|---|
| `main` | Producción — solo vía PR desde `preprod` |
| `preprod` | Pre-producción — solo vía PR desde `lab` |
| `lab` | Desarrollo, fixes y experimentos |

**Flujo**: `lab` → PR → `preprod` → PR → `main`. No commits directos a `main` ni `preprod`.

## Comandos (desde `web-app/`)

| Comando | Efecto |
|---|---|
| `npm start` | Dev server en http://localhost:3000 |
| `npm test` | Tests (react-scripts, watch mode) |
| `npm run build` | Build producción a `web-app/build/` |

## Stack y arquitectura

- **React 19** con Create React App (react-scripts 5). Sin Next, Vite, ni SSR.
- **PDF pipeline**: `html2canvas` captura el DOM renderizado → `jsPDF` ensambla el PDF. Esto implica que estilos CSS visibles afectan la salida.
- **Recorte**: `react-image-crop` en un modal.
- **Estado**: React Context (`AppContext.js`). Sin Redux ni store externo.
- **Layout**: motor propio en `src/core/layoutEngine.js` — calcula posiciones en grid y agrupa en páginas.
- **Sin backend ni DB**: 100% frontend, los archivos se procesan con FileReader en el navegador.

## Particularidades

- **Test por defecto roto**: `App.test.js` es boilerplate CRA (busca "learn react") y falla con el componente real — no confiar en `npm test` como señal de que algo anda mal.
- **Persistencia automática a IndexedDB**: `AppContext` guarda el estado en IndexedDB ante cualquier cambio y lo restaura al cargar la app. Si se modifica la forma del estado, considerar migración o `clearSession()`.
- **Sin tooling extra**: No hay prettier, husky, commit hooks, CI/CD, Docker, ni lint más allá del ESLint incluido en react-scripts.
- **Idioma**: Todo el UI y comentarios están en español.
- **Diseño**: Paleta marrón/vino/verde/oro en `styles/variables.css`. Headings usan `Cormorant Garamond` (serif), body usa `Inter` (sans). Noise texture de fondo en `global.css` via `body::before` con SVG noise filter. **No usar colores inline** — siempre referenciar las variables CSS.
