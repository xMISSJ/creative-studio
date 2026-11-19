import { getDigitalArtShowcase } from '../data/digitalArt'

export default defineEventHandler((event) => getDigitalArtShowcase(event))
