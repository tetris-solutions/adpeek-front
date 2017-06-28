import isNumber from 'lodash/isNumber'
import round from 'lodash/round'

export const parseBidModifier = value =>
  isNumber(value)
    ? round(100 * (value - 1), 2)
    : undefined

export const normalizeBidModifier = value =>
  isNumber(value)
    ? round((value / 100) + 1, 3)
    : null
