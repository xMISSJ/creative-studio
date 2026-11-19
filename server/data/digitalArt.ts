import type { H3Event } from 'h3'
import { getDigitalArtShowcase as readDigitalArtShowcase } from '../utils/digitalArtStore'

export function getDigitalArtShowcase(event?: H3Event) {
  return readDigitalArtShowcase(event)
}
