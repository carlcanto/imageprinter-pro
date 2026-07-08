---
title: Contexto Activo
updated: 2026-07-07
---

## Prioridad actual

App funcional restaurada con diseño liquid-glass + grayscale + GitHub button.

## Repositorios/áreas activas

- `imageprinter-pro` — producción en Vercel

## Commit estable

| Campo | Valor |
|-------|-------|
| **Hash** | `93be213` |
| **Mensaje** | `feat: aplicar tema azul marino de preprod + vercel.json` |
| **Autor** | CarlCanto <carloscanto04@gmail.com> |
| **Fecha** | 2026-07-03 |
| **Rama** | `main` |
| **Deploy** | Vercel (auto-deploy) |
| **Estado** | ✅ Estable — funcionalidad completa probada en preprod |

Este commit contiene todos los cambios funcionales de la rama `preprod`:
- Tema visual azul marino (Slate 900 + #3b82f6)
- vercel.json para deploy
- Componentes funcionales completos

## Herramientas instaladas

- **claude-mem v13.10.2** — memoria persistente automática inter-sesión (worker en `:37777`)
- **claude-code-security-review** — GitHub Action en `.github/workflows/security.yml` (requiere `CLAUDE_API_KEY` en GH secrets)
- **gstack** — 42 skills activas en `~/.config/opencode/skills/` (limpias de 55 originales)
- **speckit v0.12.6** — 10 comandos SDD en `.opencode/commands/` (specify, plan, tasks, implement...)
- **ui-ux-pro-max** — design intelligence en `~/.opencode/skills/` (161 reglas, 67 estilos, 22 stacks)

## En progreso

_Nada._

## Bloqueos

_Ninguno._

## Advertencias activas

- El email de git debe ser `carloscanto04@gmail.com` para que Vercel acepte los commits.

## Decisiones recientes

- Merge `preprod → main` vía checkout directo de archivos + nuevo commit (no merge convencional).
- Se evita usar `git merge` directo cuando las ramas divergen en los mismos archivos.
