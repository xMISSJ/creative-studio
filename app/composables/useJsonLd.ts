/** Inject one or more Schema.org objects as JSON-LD. */
export function useJsonLd(id: string, schema: MaybeRefOrGetter<object | object[] | null | undefined>) {
  useHead(() => {
    const value = toValue(schema)
    if (!value) return {}
    return {
      script: [
        {
          id,
          key: id,
          type: 'application/ld+json',
          children: JSON.stringify(value),
        },
      ],
    }
  })
}
