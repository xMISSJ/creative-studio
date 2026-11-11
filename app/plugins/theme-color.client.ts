export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  const apply = () => {
    const color = colorMode.value === 'dark' ? '#16141c' : '#faf9fc'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }

  watch(() => colorMode.value, apply, { immediate: true })
})
