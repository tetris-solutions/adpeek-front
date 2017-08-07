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

export function inferKeywordMatchType (str) {
  const firstChar = str[0]
  const lastChar = str[str.length - 1]

  if (firstChar === '[' && lastChar === ']') {
    return 'EXACT'
  }

  if (firstChar === '"' && firstChar === lastChar) {
    return 'PHRASE'
  }

  return 'BROAD'
}

export function parseKeyword (text, asIs = false) {
  text = text.trim()

  return {
    text: asIs ? text : cleanup(text),
    match_type: inferKeywordMatchType(text)
  }
}
