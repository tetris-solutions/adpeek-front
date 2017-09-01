import qs from 'query-string'
import {protectedRouteMiddleware} from 'tetris-iso/server'
import pick from 'lodash/pick'

export function protectSharedReportMiddleware (req, res, next) {
  if (req.user || !req.query.tkn) {
    return protectedRouteMiddleware(req, res, next)
  }

  const query = pick(req.query, 'from', 'to')

  res.redirect(`/expired/report/${req.params.reportShare}?${qs.stringify(query)}`)
}
