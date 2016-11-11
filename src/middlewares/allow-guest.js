import qs from 'query-string'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'

const ONE_DAY = 1000 * 60 * 60 * 24

export function allowGuestMiddleware ({query, path, user}, res, next) {
  const cleanQuery = omit(query, 'tkn')
  const cleanQueryString = isEmpty(cleanQuery)
    ? ''
    : '?' + qs.stringify(cleanQuery)
  const cleanPath = path + cleanQueryString

  if (user || !query.tkn) {
    return query.tkn
      ? res.redirect(cleanPath)
      : next()
  }

  const accessToken = new Buffer(query.tkn, 'base64').toString('ascii')
  const domain = process.env.TOKEN_COOKIE_DOMAIN
  const cookieName = process.env.TOKEN_COOKIE_NAME

  res.set('Authorization', `Bearer ${accessToken}`)
  res.cookie(cookieName, accessToken, {
    domain,
    expires: new Date(Date.now() + ONE_DAY)
  })

  res.redirect(cleanPath)
}
