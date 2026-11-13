---
name: web-quality
description: >-
  Audit or implement accessibility, SEO, i18n, and motion quality for the Little
  Memo Nuxt shop. Use when building or changing pages/components, reviewing UI,
  or when the user mentions accessibility, a11y, SEO, meta, contrast, keyboard,
  focus, landmarks, or structured data.
---

# Web quality (a11y + SEO)

Follow project rules in `.cursor/rules/` (`accessibility`, `seo`, `i18n`, `typography`). This skill is the working checklist when shipping UI.

## When to apply

- New page, section, form, dialog, or nav control
- Color / token / motion changes
- Meta, sharing, or Schema.org work
- User asks for an a11y or SEO pass

## Workflow

1. **Structure**: one `h1`, landmarks, skip link + route announcer untouched.
2. **Names / keyboard**: every control labeled; dialogs use trap + `inert` page; listboxes use `useListbox`.
3. **Contrast / targets**: AA text on paper; 44px hits; pastel bands use `text-on-soft`.
4. **Forms / media**: `aria-invalid` + described errors in all locales; alts correct.
5. **Motion**: enter/opacity animation only under `prefers-reduced-motion: no-preference`.
6. **SEO**: `usePageMeta` / `usePageMetaValues`; locale `meta.*` keys; `noindex` on private flows; `useJsonLd` when appropriate.
7. **i18n**: all copy via `useShopI18n().t()`; `NuxtLinkLocale`; run `pnpm check:i18n`.

## Quick verify

```bash
pnpm check:i18n
```

Manually spot-check: keyboard through new controls, open cart (header should be inert), light-mode button/link contrast, view-source / head for title + description on new pages.

## Do not

- Lighten `--accent` / `--button` without a contrast check
- Add pages without meta helpers
- Fake form success that implies data was stored or sent
- Remove skip link, focus trap, or route announcer
