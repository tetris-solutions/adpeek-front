import React from 'react'
import {IndexRoute, Route} from 'react-router'
import {root} from 'baobab-react/dist-modules/higher-order'
import {root as createRoot} from '@tetris/front-server/lib/higher-order/root'
import Home from '../components/Home'
import Workspaces from '../components/Workspaces'
import CreateWorkspace from '../components/WorkspaceCreate'

import App from '../components/App'
import {loadUserCompaniesActionRouterAdaptor} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionRouterAdaptor} from '../actions/load-company-workspaces'

const Header = () => null

/**
 * returns the route config
 * @param {Baobab} tree state tree
 * @param {Function} protectRoute access block onEnter hook
 * @param {Function} preload call this function with actions to run them onEnter
 * @returns {Route} the route config
 */
export function getRoutes (tree, protectRoute, preload) {
  return (
    <Route path='/' component={root(tree, createRoot(Header))}>
      <IndexRoute component={Home}/>
      <Route onEnter={protectRoute}>
        <Route path='company/:company' component={App} onEnter={preload(loadUserCompaniesActionRouterAdaptor)}>
          <IndexRoute component={Workspaces} onEnter={preload(loadCompanyWorkspacesActionRouterAdaptor)}/>
          <Route path='create/workspace' component={CreateWorkspace}/>
        </Route>
      </Route>
    </Route>
  )
}
