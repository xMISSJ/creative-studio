export function useOverlay() {
  const cart = useCart()

  function openCart() {
    cart.isOpen.value = true
  }

  const locked = computed(() => cart.isOpen.value)

  return { openCart, locked, cart }
}
