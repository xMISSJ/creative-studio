export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  const apply = () => {
    const color = colorMode.value === 'dark' ? '#1a1715' : '#f8f7f4'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }

  watch(() => colorMode.value, apply, { immediate: true })
})
