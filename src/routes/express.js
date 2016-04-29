import {protectedRouteMiddleware as protect} from '@tetris/front-server/lib/middlewares/protected'
import {performActionsMiddleware as preload} from '@tetris/front-server/lib/middlewares/perform-actions'
import {loadUserCompaniesActionServerAdaptor as companies} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionServerAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadCompanyRolesActionServerAdaptor as roles} from '../actions/load-company-roles'
import {loadWorkspaceFoldersActionServerAdaptor as folders} from '../actions/load-workspaces-folders'
import {loadFolderActionServerAdaptor as folder} from '../actions/load-folder'
import {loadWorkspaceAccountsActionServerAdaptor as accounts} from '../actions/load-workspaces-accounts'
import {loadMediasActionServerAdaptor as medias} from '../actions/load-medias'
import {loadWorkspaceActionServerAdaptor as workspace} from '../actions/load-workspace'
import {loadAvailableCampaignsActionServerAdaptor as availableCampaigns} from '../actions/load-available-campaigns'

export function setAppRoutes (app, render) {
  app.get('/', render)

  app.get('/company/:company',
    protect,
    preload(companies, workspaces),
    render)

  app.get('/company/:company/create/workspace',
    protect,
    preload(companies, roles),
    render)

  app.get('/company/:company/workspace/:workspace',
    protect,
    preload(companies, workspace, folders),
    render)

  app.get('/company/:company/workspace/:workspace/edit',
    protect,
    preload(companies, roles, workspace),
    render)

  app.get('/company/:company/workspace/:workspace/create/folder',
    protect,
    preload(medias, companies, workspace, accounts),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder',
    protect,
    preload(companies, workspace, folder, availableCampaigns),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/edit',
    protect,
    preload(medias, companies, workspace, accounts, folder),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/create/campaign',
    protect,
    preload(companies, workspace, folder),
    render)
}
