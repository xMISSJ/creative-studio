# Everlune

Nuxt shop for cozy coloring books. Pages, cart, and placeholders are meant to grow: accounts and checkout are not wired up yet. Product covers under `public/art/` may still be temporary stand-ins until Everlune art is ready.

## Where things live

- `site.config.ts` — shop name, currency, email, storage prefix
- `i18n/locales` — every shopper-facing sentence, in English and Dutch
- `server/data/catalog.ts` — prices, stock, images, collections
- `shared/catalog.ts` — collection list and pastel classes
- `app/composables/useCart.ts` — browser cart; swap this when accounts exist
- `app/pages` — home, shop, product, collection, cart, checkout, about, login, register, account

## Rules that already apply

- Copy goes through `useShopI18n().t()`, which injects the shop name.
- Internal links use `NuxtLinkLocale`, so Dutch stays on `/nl`.
- `pnpm check:i18n` fails the build when a locale, product, or template string drifts.
- Keep motion subtle and behind `prefers-reduced-motion`.
- Do not pretend a placeholder form saved or sent anything.

Read `.cursor/rules` for the short versions of these conventions.
