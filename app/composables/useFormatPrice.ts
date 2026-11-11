export function useFormatPrice() {
  const { locale } = useI18n()
  const brand = useBrand()

  return (cents: number) =>
    new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: brand.currency,
    }).format(cents / 100)
}
