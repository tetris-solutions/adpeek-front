import bind from 'lodash/bind'
import React from 'react'
import {loadUserCompaniesActionRouterAdaptor as companies} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {root} from 'baobab-react/higher-order'
import {IndexRoute, Route} from 'react-router'

import App from '../components/App'
import Campaign from '../components/Campaign'
import CampaignAside from '../components/CampaignAside'
import CampaignBreadcrumb from '../components/CampaignBreadcrumb'
import Campaigns from '../components/FolderCampaigns'
import CompanyAside from '../components/CompanyAside'
import CompanyBreadcrumb from '../components/CompanyBreadcrumb'
import CompanyOrders from '../components/CompanyOrders'
import CompanyOrdersCloning from '../components/CompanyOrdersCloning'
import CreateCampaign from '../components/CampaignCreate'
import CreateFolder from '../components/FolderCreate'
import CreateReport from '../components/FolderReportCreate'
import CreateWorkspace from '../components/WorkspaceCreate'
import FolderAdGroups from '../components/FolderAdGroups'
import FolderAside from '../components/FolderAside'
import FolderBreadcrumb from '../components/FolderBreadcrumb'
import FolderEdit from '../components/FolderEdit'
import FolderOrders from '../components/FolderOrders'
import FolderOrdersCloning from '../components/FolderOrdersCloning'
import FolderReportBuilder from '../components/FolderReport'
import FolderReports from '../components/FolderReports'
import Folders from '../components/Folders'
import Home from '../components/Home'
import Order from '../components/Order'
import OrderAside from '../components/OrderAside'
import OrderAutoBudget from '../components/OrderAutoBudget'
import OrderBreadCrumb from '../components/OrderBreadcrumb'
import OrdersBreadCrumb from '../components/OrdersBreadcrumb'
import ReportAside from '../components/ReportAside'
import ReportBread from '../components/ReportBreadcrumb'
import ReportsBread from '../components/ReportsBreadcrumb'
import WorkspaceAside from '../components/WorkspaceAside'
import WorkspaceBreadcrumb from '../components/WorkspaceBreadcrumb'
import WorkspaceEdit from '../components/WorkspaceEdit'
import WorkspaceOrders from '../components/WorkspaceOrders'
import WorkspaceOrdersCloning from '../components/WorkspaceOrdersCloning'
import Workspaces from '../components/Workspaces'
import ErrorScreen from '../components/ErrorScreen'

import {loadWorkspaceAccountsActionRouterAdaptor as accounts} from '../actions/load-accounts'
import {loadAutoBudgetLogsActionRouterAdaptor as autoBudgetLogs} from '../actions/load-autobudget-logs'
import {loadBudgetsActionRouterAdaptor as budgets} from '../actions/load-budgets'
import {loadCampaignsActionRouterAdaptor as campaigns} from '../actions/load-campaigns'
import {loadCompanyRolesActionRouterAdaptor as roles} from '../actions/load-company-roles'
import {loadCompanyWorkspacesActionRouterAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadDeliveryMethodsActionRouterAdaptor as deliveryMethods} from '../actions/load-delivery-methods'
import {loadFolderActionRouterAdaptor as folder} from '../actions/load-folder'
import {loadFolderReportActionRouterAdaptor as report} from '../actions/load-folder-report'
import {loadFolderReportsActionRouterAdaptor as reports} from '../actions/load-folder-reports'
import {loadWorkspaceFoldersActionRouterAdaptor as folders} from '../actions/load-folders'
import {loadMediasActionRouterAdaptor as medias} from '../actions/load-medias'
import {loadOrdersActionRouterAdaptor as orders} from '../actions/load-orders'
import {loadStatusesActionRouterAdaptor as statuses} from '../actions/load-statuses'
import {loadWorkspaceActionRouterAdaptor as workspace} from '../actions/load-workspace'

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
  const campaignsWithAdsets = bind(campaigns, null, _, _, 'include-adsets')
  const defaultFolderReport = bind(reports, null, _, _, true)

  /* eslint-disable react/jsx-indent-props */
  return (
    <Route path='/' component={root(tree, createRoot(null, ErrorScreen))}>
      <IndexRoute component={Home}/>
      <Route onEnter={protectRoute}>

        <Route path='company/:company' breadcrumb={CompanyBreadcrumb} aside={CompanyAside} component={App}
               onEnter={preload(companies)}>

          <IndexRoute component={Workspaces} onEnter={preload(workspaces)}/>

          <Route path='orders' breadcrumb={OrdersBreadCrumb} onEnter={preload(orders)}>
            <IndexRoute component={CompanyOrders}/>
            <Route path='clone' component={CompanyOrdersCloning}/>
          </Route>

          <Route path='create/workspace' component={CreateWorkspace} onEnter={preload(roles)}/>

          <Route path='workspace/:workspace' breadcrumb={WorkspaceBreadcrumb} onEnter={preload(workspace)}
                 aside={WorkspaceAside}>

            <IndexRoute component={Folders} onEnter={preload(folders)}/>

            <Route path='orders' breadcrumb={OrdersBreadCrumb} onEnter={preload(orders)}>
              <IndexRoute component={WorkspaceOrders}/>
              <Route path='clone' component={WorkspaceOrdersCloning}/>
            </Route>

            <Route path='edit' onEnter={preload(roles)} component={WorkspaceEdit}/>

            <Route path='create/folder' component={CreateFolder} onEnter={preload(medias, accounts)}/>

            <Route path='folder/:folder'
                   aside={FolderAside}
                   breadcrumb={FolderBreadcrumb}
                   onEnter={preload(folder, defaultFolderReport)}>

              <IndexRoute component={Campaigns} onEnter={preload(statuses, campaigns)}/>
              <Route path='adgroups' component={FolderAdGroups} onEnter={preload(statuses, campaigns)}/>

              <Route path='campaign/:campaign' aside={CampaignAside} breadcrumb={CampaignBreadcrumb}>
                <IndexRoute component={Campaign}/>
              </Route>

              <Route onEnter={preload(campaigns)} breadcrumb={ReportsBread}>
                <Route path='report/:report' aside={ReportAside} breadcrumb={ReportBread} onEnter={preload(report)}>
                  <IndexRoute component={FolderReportBuilder}/>
                  <Route path='edit' component={FolderReportBuilder}/>
                </Route>

                <Route path='reports'>
                  <IndexRoute onEnter={preload(reports)} component={FolderReports}/>
                  <Route path='new' component={CreateReport}/>
                </Route>
              </Route>

              <Route path='orders' breadcrumb={OrdersBreadCrumb} onEnter={preload(orders)}>
                <IndexRoute component={FolderOrders}/>
                <Route path='clone' component={FolderOrdersCloning}/>
              </Route>

              <Route breadcrumb={OrdersBreadCrumb}
                     onEnter={preload(deliveryMethods, statuses, campaignsWithAdsets, orders)}>

                <Route aside={OrderAside} path='order/:order' breadcrumb={OrderBreadCrumb}>
                  <IndexRoute onEnter={preload(budgets)} component={Order}/>
                  <Route path='autobudget' onEnter={preload(autoBudgetLogs)} component={OrderAutoBudget}/>
                  <Route path='autobudget/:day' onEnter={preload(autoBudgetLogs)} component={OrderAutoBudget}/>
                </Route>

                <Route path='create/order' component={Order}/>
              </Route>

              <Route path='edit' onEnter={preload(medias, accounts)} component={FolderEdit}/>
              <Route path='create/campaign' component={CreateCampaign}/>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
  /* eslint-enable react/jsx-indent-props */
}
