import React from 'react'
import {IndexRoute, Route} from 'react-router'
import {root} from 'baobab-react/dist-modules/higher-order'
import Home from '../components/Home'
import Workspaces from '../components/Workspaces'
import WorkspaceBreadcrumb from '../components/WorkspaceBreadcrumb'
import CreateWorkspace from '../components/WorkspaceCreate'
import CreateFolder from '../components/FolderCreate'
import CreateCampaign from '../components/CampaignCreate'
import Folders from '../components/Folders'
import FolderBreadcrumb from '../components/FolderBreadcrumb'
import CompanyBreadcrumb from '../components/CompanyBreadcrumb'
import WorkspaceAside from '../components/WorkspaceAside'
import WorkspaceEdit from '../components/WorkspaceEdit'
import FolderEdit from '../components/FolderEdit'
import FolderAside from '../components/FolderAside'
import Campaigns from '../components/Campaigns'
import Orders from '../components/Orders'
import Order from '../components/Order'
import OrderAutoBudget from '../components/OrderAutoBudget'
import OrderBreadCrumb from '../components/OrderBreadcrumb'
import OrdersBreadCrumb from '../components/OrdersBreadcrumb'

import App from '../components/App'
import {loadUserCompaniesActionRouterAdaptor as companies} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {loadCompanyWorkspacesActionRouterAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadCompanyRolesActionRouterAdaptor as roles} from '../actions/load-company-roles'
import {loadWorkspaceFoldersActionRouterAdaptor as folders} from '../actions/load-folders'
import {loadWorkspaceAccountsActionRouterAdaptor as accounts} from '../actions/load-accounts'
import {loadMediasActionRouterAdaptor as medias} from '../actions/load-medias'
import {loadWorkspaceActionRouterAdaptor as workspace} from '../actions/load-workspace'
import {loadFolderActionRouterAdaptor as folder} from '../actions/load-folder'
import {loadCampaignsActionRouterAdaptor as campaigns} from '../actions/load-campaigns'
import {loadStatusesActionRouterAdaptor as statuses} from '../actions/load-statuses'
import {loadOrdersActionRouterAdaptor as orders} from '../actions/load-orders'
import {loadBudgetsActionRouterAdaptor as budgets} from '../actions/load-budgets'
import {loadDeliveryMethodsActionRouterAdaptor as deliveryMethods} from '../actions/load-delivery-methods'
import {loadAutoBudgetLogsActionRouterAdaptor as autoBudgetLogs} from '../actions/load-autobudget-logs'
import bind from 'lodash/bind'

/**
 * returns the route config
 * @param {Baobab} tree state tree
 * @param {Function} protectRoute access block onEnter hook
 * @param {Function} preload call this function with actions to run them onEnter
 * @param {Function} createRoot higher order root elem
 * @returns {Route} the route config
 */
export function getRoutes (tree, protectRoute, preload, createRoot) {
  const _ = bind.placeholder
  const campaignsWithAdsets = bind(campaigns, null, _, _, true)

  return (
    <Route path='/' component={root(tree, createRoot())}>
      <IndexRoute component={Home}/>
      <Route onEnter={protectRoute}>

        <Route
          path='company/:company'
          breadcrumb={CompanyBreadcrumb}
          component={App}
          onEnter={preload(companies)}>

          <IndexRoute
            component={Workspaces}
            onEnter={preload(workspaces)}/>

          <Route
            path='create/workspace'
            component={CreateWorkspace}
            onEnter={preload(roles)}/>

          <Route
            path='workspace/:workspace'
            breadcrumb={WorkspaceBreadcrumb}
            onEnter={preload(workspace)}
            aside={WorkspaceAside}>

            <IndexRoute
              component={Folders}
              onEnter={preload(folders)}/>

            <Route
              path='edit'
              onEnter={preload(roles)}
              component={WorkspaceEdit}/>

            <Route
              path='create/folder'
              component={CreateFolder}
              onEnter={preload(medias, accounts)}/>

            <Route
              path='folder/:folder'
              aside={FolderAside}
              breadcrumb={FolderBreadcrumb}
              onEnter={preload(folder)}>

              <IndexRoute
                component={Campaigns}
                onEnter={preload(statuses, campaigns)}/>

              <Route
                path='orders'
                onEnter={preload(orders)}
                component={Orders}/>

              <Route
                breadcrumb={OrdersBreadCrumb}
                onEnter={preload(deliveryMethods, statuses, campaignsWithAdsets, orders)}>

                <Route path='order/:order' breadcrumb={OrderBreadCrumb}>
                  <IndexRoute onEnter={preload(budgets)} component={Order}/>
                  <Route
                    path='autobudget'
                    onEnter={preload(autoBudgetLogs)}
                    component={OrderAutoBudget}/>

                  <Route
                    path='autobudget/:day'
                    onEnter={preload(autoBudgetLogs)}
                    component={OrderAutoBudget}/>
                </Route>

                <Route
                  path='create/order'
                  component={Order}/>
              </Route>

              <Route
                path='edit'
                onEnter={preload(medias, accounts)}
                component={FolderEdit}/>

              <Route path='create/campaign' component={CreateCampaign}/>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
}
