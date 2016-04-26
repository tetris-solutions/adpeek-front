import React from 'react'
import {Link, IndexRoute, Route} from 'react-router'
import {root} from 'baobab-react/dist-modules/higher-order'
import {root as createRoot} from '@tetris/front-server/lib/higher-order/root'
import Home from '../components/Home'
import Workspaces, {Breadcrumb as WorkspaceBreadcrumb} from '../components/Workspaces'
import CreateWorkspace from '../components/WorkspaceCreate'
import CreateFolder from '../components/FolderCreate'
import CreateCampaign from '../components/CampaignCreate'
import Folders, {Breadcrumb as FolderBreadcrumb} from '../components/Folders'

import App, {Breadcrumb as CompanyBreadcrumb} from '../components/App'
import {loadUserCompaniesActionRouterAdaptor} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionRouterAdaptor} from '../actions/load-company-workspaces'
import {loadCompanyRolesActionRouterAdaptor} from '../actions/load-company-roles'
import {loadWorkspaceFoldersActionRouterAdaptor} from '../actions/load-workspaces-folders'
import {loadWorkspaceAccountsActionRouterAdaptor} from '../actions/load-workspaces-accounts'
import {loadMediasActionRouterAdaptor} from '../actions/load-medias'

const {PropTypes} = React

function Campaigns ({params: {company, workspace, folder}}) {
  return (
    <ul>
      <li>huge</li>
      <li>list</li>
      <li>of</li>
      <li>campaigns</li>
      <li>
        <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/create/campaign`}>CREATE NEW</Link>
      </li>
    </ul>
  )
}
Campaigns.displayName = 'Campaigns'
Campaigns.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string,
    folder: PropTypes.string
  })
}

/**
 * returns the route config
 * @param {Baobab} tree state tree
 * @param {Function} protectRoute access block onEnter hook
 * @param {Function} preload call this function with actions to run them onEnter
 * @returns {Route} the route config
 */
export function getRoutes (tree, protectRoute, preload) {
  return (
    <Route path='/' component={root(tree, createRoot())}>
      <IndexRoute component={Home}/>
      <Route onEnter={protectRoute}>
        <Route
          path='company/:company'
          breadcrumb={CompanyBreadcrumb}
          component={App}
          onEnter={preload(loadUserCompaniesActionRouterAdaptor)}>

          <IndexRoute component={Workspaces} onEnter={preload(loadCompanyWorkspacesActionRouterAdaptor)}/>
          <Route
            path='create/workspace'
            component={CreateWorkspace}
            onEnter={preload(loadCompanyRolesActionRouterAdaptor)}/>

          <Route path='workspace/:workspace' breadcrumb={WorkspaceBreadcrumb}>
            <IndexRoute component={Folders} onEnter={preload(loadWorkspaceFoldersActionRouterAdaptor)}/>
            <Route
              path='create/folder'
              component={CreateFolder}
              onEnter={preload(loadMediasActionRouterAdaptor, loadWorkspaceAccountsActionRouterAdaptor)}/>

            <Route path='folder/:folder' breadcrumb={FolderBreadcrumb}>
              <IndexRoute component={Campaigns}/>
              <Route path='create/campaign' component={CreateCampaign}/>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
}
