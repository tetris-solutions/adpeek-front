import bind from 'lodash/bind'
import React from 'react'
import {loadUserCompaniesActionRouterAdaptor as companies} from 'tetris-iso/actions'
import {root} from 'baobab-react/higher-order'
import {IndexRoute, Route} from 'react-router'

import {render, component} from '../loader'

import DocTitle from '../components/DocTitle'

import App from '../components/App'
import ErrorScreen from '../components/ErrorScreen'

import {node, branch} from '../components/higher-order/branch'
import {intercept} from '../functions/intercept-preload'

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

  preload = intercept(tree, preload)

  const rConfig = {
    company: {
      item: component.CompanyReport,
      list: component.ReportList,
      action: preload(savedAccounts)
    },
    workspace: {
      item: component.WorkspaceReport,
      list: component.ReportList
    },
    folder: {
      item: component.FolderReport,
      list: component.ReportList,
      action: preload(campaigns)
    }
  }

  const getReportRoutes = level => (
    <Route breadcrumb={component.ReportsBreadcrumb} onEnter={rConfig[level].action}>
      <Route
        path='report/:report'
        component={node(level, 'report')}
        aside={component.ReportAside}
        breadcrumb={component.ReportBreadcrumb}
        onEnter={preload(report)}>

        <IndexRoute {...render(rConfig[level].item)}/>
        <Route path='edit' {...render(rConfig[level].item)}/>
        <Route
          path='mailing(/:mailing)'
          onEnter={preload(mailings)}
          {...render(component.Mailing)}/>

      </Route>

      <Route path='reports'>
        <IndexRoute onEnter={preload(reports)} {...render(component.ReportList)}/>
        <Route path='new' {...render(component.ReportCreate)}/>
      </Route>
    </Route>
  )

  /* eslint-disable react/jsx-indent-props */
  return (
    <Route path='/' component={root(tree, createRoot(DocTitle, ErrorScreen))}>
      <Route path='expired/report/:report' {...render(component.Expired)}/>
      <Route
        path='mailing/:mailing/unsubscribe/:email'
        onEnter={preload(unsub)}
        {...render(component.Unsub)}/>

      <Route onEnter={protectRoute} component={branch('user')}>
        <Route
          path='share/report/:reportShare'
          aside={component.ReportAsideLite}
          breadcrumb={[component.CompanyBreadcrumb, component.WorkspaceBreadcrumb, component.FolderBreadcrumb, component.ReportBreadcrumb]}
          {...render(component.ReportShare)}/>

        <Route onEnter={preload(medias, statuses, companies)} component={App}>

          <IndexRoute {...render(component.Companies)}/>

          <Route
            path='company/:company'
            component={node('user', 'company')}
            breadcrumb={component.CompanyBreadcrumb}
            aside={component.CompanyAside}>

            <IndexRoute {...render(component.CompanyWorkspaces)} onEnter={preload(workspaces)}/>

            <Route path='mailing(/:mailing)' onEnter={preload(mailings)} {...render(component.Mailing)}/>

            {getReportRoutes('company')}

            <Route path='orders' breadcrumb={component.OrdersBreadCrumb} onEnter={preload(orders)}>
              <IndexRoute {...render(component.Orders)}/>
              <Route path='clone' {...render(component.CompanyOrdersCloning)}/>
            </Route>

            <Route path='create/workspace' {...render(component.WorkspaceCreate)} onEnter={preload(roles)}/>

            <Route path='workspace/:workspace'
                   component={node('company', 'workspace')}
                   breadcrumb={component.WorkspaceBreadcrumb}
                   onEnter={preload(workspace)}
                   aside={component.WorkspaceAside}>

              <IndexRoute {...render(component.WorkspaceFolders)} onEnter={preload(folders)}/>

              {getReportRoutes('workspace')}

              <Route path='orders' breadcrumb={component.OrdersBreadCrumb} onEnter={preload(orders)}>
                <IndexRoute {...render(component.Orders)}/>
                <Route path='clone' {...render(component.WorkspaceOrdersCloning)}/>
              </Route>

              <Route path='edit' onEnter={preload(roles)} {...render(component.WorkspaceEdit)}/>

              <Route path='create/folder' {...render(component.FolderCreate)} onEnter={preload(accounts)}/>

              <Route path='folder/:folder'
                     component={node('workspace', 'folder')}
                     aside={component.FolderAside}
                     breadcrumb={component.FolderBreadcrumb}
                     onEnter={preload(folder, campaigns)}>

                <IndexRoute {...render(component.FolderCampaigns)}/>
                <Route path='creatives' {...render(component.FolderCreatives)}/>

                <Route
                  component={node('folder', 'campaign')}
                  path='campaign/:campaign'
                  aside={component.CampaignAside}
                  breadcrumb={component.CampaignBreadcrumb}>

                  <IndexRoute {...render(component.CampaignHome)}/>
                  <Route path='creatives' {...render(component.CampaignCreatives)}/>
                </Route>

                {getReportRoutes('folder')}

                <Route path='orders' breadcrumb={component.OrdersBreadCrumb} onEnter={preload(orders)}>
                  <IndexRoute {...render(component.Orders)}/>
                  <Route path='clone' {...render(component.FolderOrdersCloning)}/>
                </Route>

                <Route breadcrumb={component.OrdersBreadCrumb}
                       onEnter={preload(deliveryMethods, campaignsWithAdsets, orders)}>

                  <Route
                    aside={component.OrderAside}
                    path='order/:order'
                    breadcrumb={component.OrderBreadCrumb}>

                    <IndexRoute onEnter={preload(budgets)} {...render(component.Order)}/>

                    <Route path='autobudget(/:day)'
                           onEnter={preload(autoBudgetLogs)}
                           {...render(component.OrderAutoBudget)}/>
                  </Route>

                  <Route path='create/order' {...render(component.Order)}/>
                </Route>

                <Route path='edit' onEnter={preload(accounts)} {...render(component.FolderEdit)}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
  /* eslint-enable react/jsx-indent-props */
}
