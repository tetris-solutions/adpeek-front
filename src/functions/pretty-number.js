import isNumber from 'lodash/isNumber'
import floor from 'lodash/floor'

const localeReplaceMap = {
  en: 'en-US',
  'en-US': 'en-US',
  'pt-BR': 'pt-BR'
}
const typeToNumberStyle = {
  percentage: 'percent',
  currency: 'currency'
}
const naiveCurrency = {
  'en-US': 'USD',
  'pt-BR': 'BRL'
}

export function prettyNumber (value, type = 'decimal', locale = 'en-US') {
  if (!isNumber(value)) return value

  const style = typeToNumberStyle[type] || 'decimal'
  const options = {style}
  const notHardTyped = !typeToNumberStyle[type]

  locale = localeReplaceMap[locale] || 'en-US'

  if (type === 'integer' || (notHardTyped && floor(value) === value)) {
    options.minimumFractionDigits = options.maximumFractionDigits = 0
  } else {
    options.maximumFractionDigits = options.minimumFractionDigits = 2
  }

  if (options.style === 'currency') {
    options.currency = naiveCurrency[locale]
  }

  return Intl.NumberFormat(locale, options).format(value)
}
