export function useOverlay() {
  const menuOpen = useState('nav-menu-open', () => false)
  const cart = useCart()

  function openMenu() {
    cart.isOpen.value = false
    menuOpen.value = true
  }

  function closeMenu() {
    menuOpen.value = false
  }

  function toggleMenu() {
    if (menuOpen.value) closeMenu()
    else openMenu()
  }

  function openCart() {
    menuOpen.value = false
    cart.isOpen.value = true
  }

  const locked = computed(() => menuOpen.value || cart.isOpen.value)

  return { menuOpen, openMenu, closeMenu, toggleMenu, openCart, locked, cart }
}
