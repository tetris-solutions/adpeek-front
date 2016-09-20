const localeReplaceMap = {
  en: 'en-US',
  'en-US': 'en-US',
  'pt-BR': 'pt-BR'
}
const typeToNumberStyle = {
  percentage: 'percent',
  quantity: 'decimal',
  currency: 'currency'
}
const naiveCurrency = {
  'en-US': 'USD',
  'pt-BR': 'BRL'
}

export function prettyNumber (value, type = 'decimal', locale = 'en-US') {
  const style = typeToNumberStyle[type] || 'decimal'
  const options = {style}

  locale = localeReplaceMap[locale] || 'en-US'

  if (options.style === 'currency') {
    options.currency = naiveCurrency[locale]
  }

  return Intl.NumberFormat(locale, options).format(value)
}
