import { spawnSync } from 'node:child_process'

const [preset, command, ...rest] = process.argv.slice(2)
if (!preset || !command) {
  console.error('Usage: node scripts/nuxt-with-preset.mjs <preset> <nuxt-command> [args...]')
  process.exit(1)
}

process.env.NITRO_PRESET = preset
const result = spawnSync('nuxt', [command, ...rest], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})
process.exit(result.status ?? 1)
