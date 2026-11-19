import { getCatalog } from '../../data/catalog'

export default defineEventHandler((event) => getCatalog(event))
