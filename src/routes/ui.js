import bind from 'lodash/bind'
import React from 'react'
import {loadUserCompaniesActionRouterAdaptor as companies} from 'tetris-iso/actions'
import {root} from 'baobab-react/higher-order'
import {IndexRoute, Route} from 'react-router'

import App from '../components/App'
import DocTitle from '../components/DocTitle'
import CampaignCreatives from '../components/CampaignCreatives'
import CampaignAside from '../components/CampaignAside'
import CampaignBreadcrumb from '../components/CampaignBreadcrumb'
import Campaigns from '../components/FolderCampaigns'
import CompanyAside from '../components/CompanyAside'
import CompanyBreadcrumb from '../components/CompanyBreadcrumb'
import CompanyOrders from '../components/CompanyOrders'
import CompanyOrdersCloning from '../components/CompanyOrdersCloning'
import CreateFolder from '../components/FolderCreate'
import ReportCreate from '../components/Report/CreateForm'
import CreateWorkspace from '../components/WorkspaceCreate'
import FolderCreatives from '../components/FolderCreatives'
import FolderAside from '../components/FolderAside'
import FolderBreadcrumb from '../components/FolderBreadcrumb'
import FolderEdit from '../components/FolderEdit'
import FolderOrders from '../components/FolderOrders'
import FolderOrdersCloning from '../components/FolderOrdersCloning'
import FolderReport from '../components/FolderReport'
import WorkspaceReport from '../components/WorkspaceReport'
import CompanyReport from '../components/CompanyReport'
import FolderReports from '../components/FolderReports'
import WorkspaceReports from '../components/WorkspaceReports'
import CompanyReports from '../components/CompanyReports'
import Folders from '../components/Folders'
import Companies from '../components/Companies'
import Order from '../components/Order'
import OrderAside from '../components/OrderAside'
import OrderAutoBudget from '../components/OrderAutoBudget'
import OrderBreadCrumb from '../components/OrderBreadcrumb'
import OrdersBreadCrumb from '../components/OrdersBreadcrumb'
import ReportAside from '../components/Report/Aside'
import ReportAsideLite from '../components/Report/AsideLite'
import ReportBread from '../components/Report/Breadcrumb'
import ReportsBread from '../components/Report/ListBreadcrumb'
import WorkspaceAside from '../components/WorkspaceAside'
import WorkspaceBreadcrumb from '../components/WorkspaceBreadcrumb'
import WorkspaceEdit from '../components/WorkspaceEdit'
import WorkspaceOrders from '../components/WorkspaceOrders'
import WorkspaceOrdersCloning from '../components/WorkspaceOrdersCloning'
import Workspaces from '../components/Workspaces'
import ErrorScreen from '../components/ErrorScreen'
import ReportShare from '../components/Report/Share'
import Mailing from '../components/Report/Mailing'
import Unsub from '../components/Report/Unsub'

import {loadWorkspaceAccountsActionRouterAdaptor as accounts} from '../actions/load-accounts'
import {loadAutoBudgetLogsActionRouterAdaptor as autoBudgetLogs} from '../actions/load-autobudget-logs'
import {loadBudgetsActionRouterAdaptor as budgets} from '../actions/load-budgets'
import {loadFolderCampaignsActionRouterAdaptor as campaigns} from '../actions/load-folder-campaigns'
import {loadCompanyRolesActionRouterAdaptor as roles} from '../actions/load-company-roles'
import {loadCompanyWorkspacesActionRouterAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadDeliveryMethodsActionRouterAdaptor as deliveryMethods} from '../actions/load-delivery-methods'
import {loadFolderActionRouterAdaptor as folder} from '../actions/load-folder'
import {loadReportActionRouterAdaptor as report} from '../actions/load-report'
import {loadReportsActionRouterAdaptor as reports} from '../actions/load-reports'
import {loadWorkspaceFoldersActionRouterAdaptor as folders} from '../actions/load-folders'
import {loadMediasActionRouterAdaptor as medias} from '../actions/load-medias'
import {loadOrdersActionRouterAdaptor as orders} from '../actions/load-orders'
import {loadStatusesActionRouterAdaptor as statuses} from '../actions/load-statuses'
import {loadWorkspaceActionRouterAdaptor as workspace} from '../actions/load-workspace'
import {loadCompanySavedAccountsActionRouterAdaptor as savedAccounts} from '../actions/load-company-saved-accounts'
import {loadMailingListActionRouterAdaptor as mailings} from '../actions/load-mailing-list'
import {unsubscribeActionRouterAdaptor as unsub} from '../actions/unsub'
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

  /* eslint-disable react/jsx-indent-props */
  return (
    <Route path='/' component={root(tree, createRoot(DocTitle, ErrorScreen))}>
      <Route
        path='mailing/:mailing/unsubscribe/:email'
        onEnter={preload(unsub)}
        component={Unsub}/>

      <Route onEnter={protectRoute}>
        <Route
          path='share/report/:reportShare'
          aside={ReportAsideLite}
          breadcrumb={[CompanyBreadcrumb, WorkspaceBreadcrumb, FolderBreadcrumb, ReportBread]}
          component={ReportShare}/>

        <Route onEnter={preload(companies)} component={App}>
          <IndexRoute component={Companies}/>
          <Route
            path='company/:company'
            breadcrumb={CompanyBreadcrumb}
            onEnter={preload(statuses)}
            aside={CompanyAside}>

            <IndexRoute component={Workspaces} onEnter={preload(workspaces)}/>
            <Route path='mailing(/:mailing)' onEnter={preload(mailings)} component={Mailing}/>

            <Route breadcrumb={ReportsBread} onEnter={preload(savedAccounts)}>
              <Route
                path='report/:report'
                aside={ReportAside}
                breadcrumb={ReportBread}
                onEnter={preload(report)}
                component={CompanyReport}>

                <Route path='edit'/>
                <Route path='mailing(/:mailing)' onEnter={preload(mailings)} component={Mailing}/>
              </Route>

              <Route path='reports'>
                <IndexRoute onEnter={preload(reports)} component={CompanyReports}/>
                <Route path='new' component={ReportCreate}/>
              </Route>
            </Route>

            <Route path='orders' breadcrumb={OrdersBreadCrumb} onEnter={preload(orders)}>
              <IndexRoute component={CompanyOrders}/>
              <Route path='clone' component={CompanyOrdersCloning}/>
            </Route>

            <Route path='create/workspace' component={CreateWorkspace} onEnter={preload(roles)}/>

            <Route path='workspace/:workspace'
                   breadcrumb={WorkspaceBreadcrumb}
                   onEnter={preload(workspace)}
                   aside={WorkspaceAside}>

              <IndexRoute component={Folders} onEnter={preload(folders)}/>

              <Route breadcrumb={ReportsBread}>
                <Route path='report/:report'
                       breadcrumb={ReportBread}
                       aside={ReportAside}
                       onEnter={preload(report)}
                       component={WorkspaceReport}>

                  <Route path='edit'/>
                  <Route path='mailing(/:mailing)' onEnter={preload(mailings)} component={Mailing}/>
                </Route>

                <Route path='reports'>
                  <IndexRoute onEnter={preload(reports)} component={WorkspaceReports}/>
                  <Route path='new' component={ReportCreate}/>
                </Route>
              </Route>

              <Route path='orders' breadcrumb={OrdersBreadCrumb} onEnter={preload(orders)}>
                <IndexRoute component={WorkspaceOrders}/>
                <Route path='clone' component={WorkspaceOrdersCloning}/>
              </Route>

              <Route path='edit' onEnter={preload(roles)} component={WorkspaceEdit}/>

              <Route path='create/folder' component={CreateFolder} onEnter={preload(medias, accounts)}/>

              <Route path='folder/:folder'
                     aside={FolderAside}
                     breadcrumb={FolderBreadcrumb}
                     onEnter={preload(folder)}>

                <IndexRoute component={Campaigns} onEnter={preload(campaigns)}/>
                <Route path='creatives' component={FolderCreatives} onEnter={preload(campaigns)}/>

                <Route path='campaign/:campaign' aside={CampaignAside} breadcrumb={CampaignBreadcrumb}>
                  <Route path='creatives' component={CampaignCreatives}/>
                </Route>

                <Route onEnter={preload(campaigns)} breadcrumb={ReportsBread}>
                  <Route
                    path='report/:report'
                    aside={ReportAside}
                    breadcrumb={ReportBread}
                    onEnter={preload(report)}
                    component={FolderReport}>

                    <Route path='edit'/>
                    <Route path='mailing(/:mailing)' onEnter={preload(mailings)} component={Mailing}/>
                  </Route>

                  <Route path='reports'>
                    <IndexRoute onEnter={preload(reports)} component={FolderReports}/>
                    <Route path='new' component={ReportCreate}/>
                  </Route>
                </Route>

                <Route path='orders' breadcrumb={OrdersBreadCrumb} onEnter={preload(orders)}>
                  <IndexRoute component={FolderOrders}/>
                  <Route path='clone' component={FolderOrdersCloning}/>
                </Route>

                <Route breadcrumb={OrdersBreadCrumb}
                       onEnter={preload(deliveryMethods, campaignsWithAdsets, orders)}>

                  <Route
                    aside={OrderAside}
                    path='order/:order'
                    breadcrumb={OrderBreadCrumb}>

                    <IndexRoute onEnter={preload(budgets)} component={Order}/>
                    <Route path='autobudget' onEnter={preload(autoBudgetLogs)} component={OrderAutoBudget}/>
                    <Route path='autobudget/:day' onEnter={preload(autoBudgetLogs)} component={OrderAutoBudget}/>
                  </Route>

                  <Route path='create/order' component={Order}/>
                </Route>

                <Route path='edit' onEnter={preload(medias, accounts)} component={FolderEdit}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
  /* eslint-enable react/jsx-indent-props */
}
