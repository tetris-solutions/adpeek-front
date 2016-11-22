const ONE_DAY = 1000 * 60 * 60 * 24

export function allowGuestMiddleware ({query, user}, res, next) {
  if (!user && query.tkn) {
    const accessToken = new Buffer(query.tkn, 'base64').toString('ascii')
    const domain = process.env.TOKEN_COOKIE_DOMAIN
    const cookieName = process.env.TOKEN_COOKIE_NAME

    res.set('Authorization', `Bearer ${accessToken}`)
    res.cookie(cookieName, accessToken, {
      domain,
      expires: new Date(Date.now() + ONE_DAY)
    })
  }

  next()
}
