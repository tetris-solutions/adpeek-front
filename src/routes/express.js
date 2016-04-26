import {protectedRouteMiddleware as protect} from '@tetris/front-server/lib/middlewares/protected'
import {performActionsMiddleware as preload} from '@tetris/front-server/lib/middlewares/perform-actions'
import {loadUserCompaniesActionServerAdaptor as companies} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionServerAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadCompanyRolesActionServerAdaptor as roles} from '../actions/load-company-roles'
import {loadWorkspaceFoldersActionServerAdaptor as folders} from '../actions/load-workspaces-folders'
import {loadWorkspaceAccountsActionServerAdaptor as accounts} from '../actions/load-workspaces-accounts'
import {loadMediasActionServerAdaptor as medias} from '../actions/load-medias'

export function setAppRoutes (app, render) {
  app.get('/', render)

  app.get('/company/:company',
    protect,
    preload(companies, workspaces),
    render)

  app.get('/company/:company/create/workspace',
    protect,
    preload(companies, workspaces, roles),
    render)

  app.get('/company/:company/workspace/:workspace',
    protect,
    preload(companies, workspaces, folders),
    render)

  app.get('/company/:company/workspace/:workspace/create/folder',
    protect,
    preload(medias, companies, workspaces, folders, accounts),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder',
    protect,
    preload(companies, workspaces, folders),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/create/campaign',
    protect,
    preload(companies, workspaces, folders),
    render)
}
