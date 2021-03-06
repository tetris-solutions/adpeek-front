import qs from 'query-string'
import assign from 'lodash/assign'

const ONE_DAY = 1000 * 60 * 60 * 24

export function allowGuestMiddleware ({query, path, user}, res, next) {
  if (
    user || // user already loaded
    query._t || // guest token param already handled
    !query.tkn // don't even
  ) {
    return next()
  }

  const accessToken = Buffer.from(query.tkn, 'base64').toString('ascii')
  const domain = process.env.TOKEN_COOKIE_DOMAIN
  const cookieName = process.env.TOKEN_COOKIE_NAME

  res.set('Authorization', `Bearer ${accessToken}`)
  res.cookie(cookieName, accessToken, {
    domain,
    expires: new Date(Date.now() + ONE_DAY)
  })

  // redirect the user so the guest session is loaded

  query = assign({}, query)
  query._t = Date.now()

  res.redirect(path + '?' + qs.stringify(query))
}
