import startsWith from 'lodash/startsWith'
import endsWith from 'lodash/endsWith'

export const cleanup = text => text.trim().replace(/^["[]/g, '').replace(/["\]]$/g, '')

export function formatKeyword (text, match_type) {
  switch (match_type) {
    case 'EXACT':
      return `[${cleanup(text)}]`
    case 'PHRASE':
      return `"${cleanup(text)}"`
    default:
      return cleanup(text)
  }
}

export function parseKeyword (text, asIs = false) {
  text = text.trim()

  const keyword = {
    text: asIs ? text : cleanup(text),
    match_type: 'BROAD'
  }

  if (startsWith(text, '[') && endsWith(text, ']')) {
    keyword.match_type = 'EXACT'
  }

  if (startsWith(text, '"') && endsWith(text, '"')) {
    keyword.match_type = 'PHRASE'
  }

  return keyword
}
