import get from 'lodash/get'
import find from 'lodash/find'

/**
 *
 * @param {Array} urls url array
 * @return {String} as a string
 */
export const pickFullUrl = urls => get(find(urls, {key: 'FULL'}), 'value')

export function findTemplateAdId (urls) {
  const url = pickFullUrl(urls)

  if (!url) {
    return null
  }

  const parts = url.split('/')

  return parts[parts.length - 2]
}

export function findTemplateAdUrl (urls) {
  const htmlUrl = pickFullUrl(urls)

  return htmlUrl
    ? htmlUrl.replace('/sadbundle/', '/simgad/').replace('/index.html', '')
    : null
}
