import {protectedRouteMiddleware} from '@tetris/front-server/lib/middlewares/protected'
import {performActionsMiddleware} from '@tetris/front-server/lib/middlewares/perform-actions'
import {loadUserCompaniesActionServerAdaptor} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionServerAdaptor} from '../actions/load-company-workspaces'
import {loadCompanyRolesActionServerAdaptor} from '../actions/load-company-roles'
import {loadWorkspaceFoldersActionServerAdaptor} from '../actions/load-workspaces-folders'

export function setAppRoutes (app, uiRoute) {
  app.get('/', uiRoute)

  app.get('/company/:company',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyWorkspacesActionServerAdaptor),
    uiRoute)

  app.get('/company/:company/create/workspace',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyWorkspacesActionServerAdaptor,
      loadCompanyRolesActionServerAdaptor),
    uiRoute)

  app.get('/company/:company/workspace/:workspace',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyWorkspacesActionServerAdaptor,
      loadWorkspaceFoldersActionServerAdaptor),
    uiRoute)

  app.get('/company/:company/workspace/:workspace/create/folder',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyWorkspacesActionServerAdaptor,
      loadWorkspaceFoldersActionServerAdaptor),
    uiRoute)
}
