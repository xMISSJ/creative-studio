import type { H3Event } from 'h3'
import {
  getShopCatalogItem,
  getShopCatalogPayload,
  readShopCatalogFile,
} from '../utils/shopStore'

/** Local JSON snapshot for tooling / seeds. Runtime prefers D1 when bound. */
export function listCatalogItems() {
  return readShopCatalogFile().items
}

export function getCatalog(event?: H3Event) {
  return getShopCatalogPayload(event)
}

export function getCatalogItem(slug: string, event?: H3Event) {
  return getShopCatalogItem(slug, event)
}
