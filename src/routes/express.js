import {protectedRouteMiddleware} from '@tetris/front-server/lib/middlewares/protected'
import {performActionsMiddleware} from '@tetris/front-server/lib/middlewares/perform-actions'
import {loadUserCompaniesActionServerAdaptor} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionServerAdaptor} from '../actions/load-company-workspaces'

export function setAppRoutes (app, uiRoute) {
  app.get('/', uiRoute)

  app.get('/company/:company',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyWorkspacesActionServerAdaptor),
    uiRoute)
}
