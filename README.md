# Little Memo

A small Nuxt shop for cozy coloring books. The visible name is **Little Memo** (Chinese mark **小忆**).

Product covers currently use temporary original placeholder art while Little Memo covers are still being drawn. Replace the files under `public/art/` and keep the same paths, or update `image` in `server/data/catalog.ts`.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Dutch is at `/nl`, and the language switcher keeps the current page. The first visit follows the browser language.

```bash
pnpm check:i18n
pnpm build
```

## Change the name

Edit `name` and `subtitle` in `site.config.ts`. Sentences use `{name}` and `{subtitle}`, so the locale files do not need a rewrite for a rename. Leave `storagePrefix` as-is if you want existing carts and theme choices to remain.

## Add a book

1. Add a row in `server/data/catalog.ts`.
2. Add `public/art/<slug>.png` (or another image path on that row).
3. Add `products.<slug>` in both `i18n/locales/en.json` and `i18n/locales/nl.json`.
4. Run `pnpm check:i18n`.

A new theme also needs an entry in `shared/catalog.ts` and a `collections.<slug>` block in every locale file. Coloring-book themes today are `classic`, `nature`, `fantasy`, and `holiday-seasonal`.

## What is intentionally unfinished

Accounts, newsletter signup, and checkout are placeholders. They explain that nothing is saved or sent. The cart lives in this browser only.

Colors, type, and motion live in `app/assets/css/main.css`. The lilac, blush, sage, and peach tokens are the palette.

Agent conventions for this repo are in `AGENTS.md`.
