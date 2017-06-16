import toLower from 'lodash/toLower'
import deburr from 'lodash/deburr'
import includes from 'lodash/includes'
import split from 'lodash/split'
import isString from 'lodash/isString'

export function checkBlacklistedWords (str) {
  if (!isString(str)) return false

  const cleanStr = deburr(toLower(str))
  const words = split(cleanStr, ' ')

  return (
    includes(str, '!!') ||
    includes(words, 'clique') ||
    includes(words, 'confira') ||
    includes(words, 'visite')
  )
}
