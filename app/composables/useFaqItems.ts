export function useFaqItems() {
  const { t } = useShopI18n()

  return computed(() => [
    { id: 'faq-1', q: t('home.faq.items.0.q'), a: t('home.faq.items.0.a') },
    { id: 'faq-2', q: t('home.faq.items.1.q'), a: t('home.faq.items.1.a') },
    { id: 'faq-3', q: t('home.faq.items.2.q'), a: t('home.faq.items.2.a') },
    { id: 'faq-4', q: t('home.faq.items.3.q'), a: t('home.faq.items.3.a') },
    { id: 'faq-5', q: t('home.faq.items.4.q'), a: t('home.faq.items.4.a') },
  ])
}
