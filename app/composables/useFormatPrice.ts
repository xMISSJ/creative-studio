export function useFormatPrice() {
  const { locale } = useI18n()
  const { currency, convertFromBase } = useCurrency()

  return (cents: number) =>
    new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currency.value,
    }).format(convertFromBase(cents))
}
