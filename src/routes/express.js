import bind from 'lodash/bind'
import forEach from 'lodash/forEach'
import {loadUserCompaniesActionServerAdaptor as companies} from 'tetris-iso/actions'
import {protectedRouteMiddleware as protect, performActionsMiddleware as preload} from 'tetris-iso/server'
import {allowGuestMiddleware} from '../middlewares/allow-guest'
import {protectSharedReportMiddleware} from '../middlewares/protect-shared-report'

import {loadReportShareActionServerAdaptor as reportShareMetaData} from '../actions/load-report-share'
import {loadWorkspaceAccountsActionServerAdaptor as accounts} from '../actions/load-accounts'
import {loadAutoBudgetLogsActionServerAdaptor as autoBudgetLogs} from '../actions/load-autobudget-logs'
import {loadBudgetsActionServerAdaptor as budgets} from '../actions/load-budgets'
import {loadFolderCampaignsActionServerAdaptor as campaigns} from '../actions/load-folder-campaigns'
import {loadCompanyRolesActionServerAdaptor as roles} from '../actions/load-company-roles'
import {loadCompanyWorkspacesActionServerAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadDeliveryMethodsActionServerAdaptor as deliveryMethods} from '../actions/load-delivery-methods'
import {loadFolderActionServerAdaptor as folder} from '../actions/load-folder'

import {
  loadReportActionServerAdaptor as report,
  loadReportShareActionServerAdaptor as reportShare
} from '../actions/load-report'

import {loadReportsActionServerAdaptor as reports} from '../actions/load-reports'
import {loadWorkspaceFoldersActionServerAdaptor as folders} from '../actions/load-folders'
import {loadMediasActionServerAdaptor as medias} from '../actions/load-medias'
import {loadOrdersActionServerAdaptor as orders} from '../actions/load-orders'
import {loadStatusesActionServerAdaptor as statuses} from '../actions/load-statuses'
import {loadWorkspaceActionServerAdaptor as workspace} from '../actions/load-workspace'
import {loadCompanySavedAccountsActionServerAdaptor as savedAccounts} from '../actions/load-company-saved-accounts'
import {loadMailingListActionServerAdaptor as mailings} from '../actions/load-mailing-list'
import {unsubscribeActionServerAdaptor as unsub} from '../actions/unsub'

export function setAppRoutes (app, render) {
  const _ = bind.placeholder
  const campaignsWithAdsets = bind(campaigns, null, _, _, 'include-adsets')

  const ensureLoad = (...args) => preload(statuses, medias, companies, ...args)

  app.get('/expired/report/:report', render)
  app.get('/mailing/:mailing/unsubscribe/:email',
    preload(unsub),
    render)

  app.get('/',
    protect,
    ensureLoad(),
    render)

  app.get('/share/report/:reportShare',
    allowGuestMiddleware,
    protectSharedReportMiddleware,
    preload(statuses, reportShareMetaData, reportShare),
    render)

  app.get('/company/:company',
    protect,
    ensureLoad(workspaces),
    render)

  app.get('/company/:company/mailing/:mailing?',
    protect,
    ensureLoad(mailings),
    render)

  app.get('/company/:company/reports',
    protect,
    ensureLoad(savedAccounts, reports),
    render)

  app.get('/company/:company/reports/new',
    protect,
    ensureLoad(savedAccounts, reports),
    render)

  app.get('/company/:company/report/:report',
    protect,
    ensureLoad(savedAccounts, report),
    render)

  app.get('/company/:company/report/:report/edit',
    protect,
    ensureLoad(savedAccounts, report),
    render)

  app.get('/company/:company/report/:report/mailing/:mailing?',
    protect,
    ensureLoad(savedAccounts, report, mailings),
    render)

  app.get('/company/:company/orders',
    protect,
    ensureLoad(orders),
    render)

  app.get('/company/:company/orders',
    protect,
    ensureLoad(orders),
    render)

  app.get('/company/:company/orders/clone',
    protect,
    ensureLoad(orders),
    render)

  app.get('/company/:company/create/workspace',
    protect,
    ensureLoad(roles),
    render)

  app.get('/company/:company/workspace/:workspace',
    protect,
    ensureLoad(workspace, folders),
    render)

  app.get('/company/:company/workspace/:workspace/reports',
    protect,
    ensureLoad(workspace, reports),
    render)

  app.get('/company/:company/workspace/:workspace/reports/new',
    protect,
    ensureLoad(workspace, reports),
    render)

  app.get('/company/:company/workspace/:workspace/report/:report',
    protect,
    ensureLoad(workspace, report),
    render)

  app.get('/company/:company/workspace/:workspace/report/:report/edit',
    protect,
    ensureLoad(workspace, report),
    render)

  app.get('/company/:company/workspace/:workspace/report/:report/mailing/:mailing?',
    protect,
    ensureLoad(workspace, report, mailings),
    render)

  app.get('/company/:company/workspace/:workspace/orders',
    protect,
    ensureLoad(workspace, orders),
    render)

  app.get('/company/:company/workspace/:workspace/orders/clone',
    protect,
    ensureLoad(workspace, orders),
    render)

  app.get('/company/:company/workspace/:workspace/edit',
    protect,
    ensureLoad(roles, workspace),
    render)

  app.get('/company/:company/workspace/:workspace/create/folder',
    protect,
    ensureLoad(workspace, accounts),
    render)

  forEach([
    '',
    '/locations',
    '/conversion-trackers',
    '/site-links',
    '/apps',
    '/call-outs',
    '/tracking'
  ], section =>
    app.get(`/company/:company/workspace/:workspace/folder/:folder/account${section}`,
      protect,
      ensureLoad(workspace, folder),
      render))

  const subFolderActions = [workspace, folder, campaigns]

  app.get('/company/:company/workspace/:workspace/folder/:folder',
    protect,
    ensureLoad(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/create/campaign',
    protect,
    ensureLoad(...subFolderActions),
    render)

  subFolderActions.push(reports)

  app.get('/company/:company/workspace/:workspace/folder/:folder/reports',
    protect,
    ensureLoad(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/reports/new',
    protect,
    ensureLoad(...subFolderActions),
    render)

  subFolderActions.pop()
  subFolderActions.push(report)

  app.get('/company/:company/workspace/:workspace/folder/:folder/report/:report',
    protect,
    ensureLoad(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/report/:report/edit',
    protect,
    ensureLoad(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/report/:report/mailing/:mailing?',
    protect,
    ensureLoad(...subFolderActions.concat([mailings])),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/creatives',
    protect,
    ensureLoad(workspace, folder, campaigns),
    render)

  forEach(['',
    '/shopping-setup',
    '/edit/tracking',
    '/edit/name',
    '/edit/status',
    '/edit/language',
    '/edit/delivery-method',
    '/edit/network',
    '/edit/geo-location',
    '/edit/optimization-status',
    '/edit/platform',
    '/edit/bid-strategy',
    '/edit/site-links',
    '/edit/call-outs',
    '/edit/apps',
    '/edit/locations',
    '/edit/dynamic-search-ads',
    '/edit/user-lists',
    '/creatives',
    '/creatives/edit'], path =>
    app.get(`/company/:company/workspace/:workspace/folder/:folder/campaign/:campaign${path}`,
      protect,
      ensureLoad(workspace, folder, campaigns),
      render))

  app.get('/company/:company/workspace/:workspace/folder/:folder/orders',
    protect,
    ensureLoad(workspace, folder, orders),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/orders/clone',
    protect,
    ensureLoad(workspace, folder, orders),
    render)

  forEach(['', '/budget/:budget'], sPath =>
    app.get(`/company/:company/workspace/:workspace/folder/:folder/order/:order${sPath}`,
      protect,
      ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets),
      render))

  app.get('/company/:company/workspace/:workspace/folder/:folder/order/:order/autobudget',
    protect,
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets, autoBudgetLogs),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/order/:order/autobudget/:day',
    protect,
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets, autoBudgetLogs),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/create/order',
    protect,
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/edit',
    protect,
    ensureLoad(workspace, accounts, folder),
    render)
}
