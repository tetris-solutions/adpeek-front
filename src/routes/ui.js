import bind from 'lodash/bind'
import React from 'react'
import {loadUserCompaniesActionRouterAdaptor as companies} from 'tetris-iso/actions'
import {root} from 'baobab-react/higher-order'
import {IndexRoute, Route} from 'react-router'

import {load, component} from '../loader'

import DocTitle from '../components/DocTitle'

import App from '../components/App'
import ErrorScreen from '../components/ErrorScreen'

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

  const getReportRoutes = (ITEM, LS, onEnter) => (
    <Route breadcrumb={load.ReportsBreadcrumb} onEnter={onEnter}>
      <Route
        path='report/:report'
        aside={load.ReportAside}
        breadcrumb={load.ReportBreadcrumb}
        onEnter={preload(report)}
        {...component(ITEM)}>

        <Route path='edit'/>
        <Route
          path='mailing(/:mailing)'
          onEnter={preload(mailings)}
          {...component(load.Mailing)}/>

      </Route>

      <Route path='reports'>
        <IndexRoute onEnter={preload(reports)} {...component(LS)}/>
        <Route path='new' {...component(load.ReportCreate)}/>
      </Route>
    </Route>
  )

  /* eslint-disable react/jsx-indent-props */
  return (
    <Route path='/' component={root(tree, createRoot(DocTitle, ErrorScreen))}>
      <Route
        path='mailing/:mailing/unsubscribe/:email'
        onEnter={preload(unsub)}
        {...component(load.Unsub)}/>

      <Route onEnter={protectRoute}>
        <Route
          path='share/report/:reportShare'
          aside={load.ReportAsideLite}
          breadcrumb={[load.CompanyBreadcrumb, load.WorkspaceBreadcrumb, load.FolderBreadcrumb, load.ReportBreadcrumb]}
          {...component(load.ReportShare)}/>

        <Route onEnter={preload(companies)} component={App}>

          <IndexRoute {...component(load.Companies)}/>
          <Route
            path='company/:company'
            breadcrumb={load.CompanyBreadcrumb}
            onEnter={preload(statuses)}
            aside={load.CompanyAside}>

            <IndexRoute {...component(load.CompanyWorkspaces)} onEnter={preload(workspaces)}/>

            <Route path='mailing(/:mailing)' onEnter={preload(mailings)} {...component(load.Mailing)}/>

            {getReportRoutes(load.CompanyReport, load.CompanyReports, preload(savedAccounts))}

            <Route path='orders' breadcrumb={load.OrdersBreadCrumb} onEnter={preload(orders)}>
              <IndexRoute {...component(load.CompanyOrders)}/>
              <Route path='clone' {...component(load.CompanyOrdersCloning)}/>
            </Route>

            <Route path='create/workspace' {...component(load.WorkspaceCreate)} onEnter={preload(roles)}/>

            <Route path='workspace/:workspace'
                   breadcrumb={load.WorkspaceBreadcrumb}
                   onEnter={preload(workspace)}
                   aside={load.WorkspaceAside}>

              <IndexRoute {...component(load.WorkspaceFolders)} onEnter={preload(folders)}/>

              {getReportRoutes(load.WorkspaceReport, load.WorkspaceReports)}

              <Route path='orders' breadcrumb={load.OrdersBreadCrumb} onEnter={preload(orders)}>
                <IndexRoute {...component(load.WorkspaceOrders)}/>
                <Route path='clone' {...component(load.WorkspaceOrdersCloning)}/>
              </Route>

              <Route path='edit' onEnter={preload(roles)} {...component(load.WorkspaceEdit)}/>

              <Route path='create/folder' {...component(load.FolderCreate)} onEnter={preload(medias, accounts)}/>

              <Route path='folder/:folder'
                     aside={load.FolderAside}
                     breadcrumb={load.FolderBreadcrumb}
                     onEnter={preload(folder)}>

                <IndexRoute {...component(load.FolderCampaigns)} onEnter={preload(campaigns)}/>
                <Route path='creatives' {...component(load.FolderCreatives)} onEnter={preload(campaigns)}/>

                <Route path='campaign/:campaign' aside={load.CampaignAside} breadcrumb={load.CampaignBreadcrumb}>
                  <Route path='creatives' {...component(load.CampaignCreatives)}/>
                </Route>

                {getReportRoutes(load.FolderReport, load.FolderReports, preload(campaigns))}

                <Route path='orders' breadcrumb={load.OrdersBreadCrumb} onEnter={preload(orders)}>
                  <IndexRoute {...component(load.FolderOrders)}/>
                  <Route path='clone' {...component(load.FolderOrdersCloning)}/>
                </Route>

                <Route breadcrumb={load.OrdersBreadCrumb}
                       onEnter={preload(deliveryMethods, campaignsWithAdsets, orders)}>

                  <Route aside={load.OrderAside} path='order/:order' breadcrumb={load.OrderBreadCrumb}>
                    <IndexRoute onEnter={preload(budgets)} {...component(load.Order)}/>

                    <Route path='autobudget(/:day)'
                           onEnter={preload(autoBudgetLogs)}
                           {...component(load.OrderAutoBudget)}/>
                  </Route>

                  <Route path='create/order' {...component(load.Order)}/>
                </Route>

                <Route path='edit' onEnter={preload(medias, accounts)} {...component(load.FolderEdit)}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
  /* eslint-enable react/jsx-indent-props */
}
