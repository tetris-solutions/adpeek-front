import join from 'lodash/join'
import compact from 'lodash/compact'
import head from 'lodash/head'
import isString from 'lodash/isString'

export function finalUrlsDomain (final_urls) {
  const finalUrl = head(final_urls)

  if (!isString(finalUrl)) return null

  const urlParts = finalUrl
    .replace(/.*?:\/\//g, '')
    .split('/')

  return head(urlParts)
}

export function inferDisplayUrl (final_urls, path_1, path_2) {
  const domain = finalUrlsDomain(final_urls)

  if (!domain) return null

  const url = join(compact([domain, path_1, path_2]), '/')

  return url.replace(/\/$/g, '')
}
