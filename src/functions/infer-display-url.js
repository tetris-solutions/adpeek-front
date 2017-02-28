import startsWith from 'lodash/startsWith'
import join from 'lodash/join'
import compact from 'lodash/compact'

const w3 = 'www.'
const stripW3 = str => startsWith(str, w3) ? str.substr(w3.length) : str

export function inferDisplayUrl (final_urls, path_1, path_2) {
  if (!final_urls || !final_urls[0]) return null

  const path_0 = final_urls[0]
    .replace(/.*?:\/\//g, '')
    .split('/')[0]

  const url = join(compact([`www.${stripW3(path_0)}`, path_1, path_2]), '/')

  return url.replace(/\/$/g, '')
}
