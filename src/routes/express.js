import bind from 'lodash/bind'
import forEach from 'lodash/forEach'
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
import {loadUserCompaniesActionServerAdaptor as companies} from '../actions/load-user-companies'
import {shortenUrlMiddleware} from '../middlewares/shorten-url'

const subAccountRoutes = [
  '',
  '/locations',
  '/conversion-trackers',
  '/site-links',
  '/apps',
  '/call-outs',
  '/tracking'
]

const subCampaignRoutes = [
  '',
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
  '/creatives/edit'
]

function getHelpers (app, render) {
  const ensureLoad = (...args) =>
    preload(statuses, medias, companies, ...args)

  const route = (url, ...middlewares) =>
    app.get(url, shortenUrlMiddleware, ...middlewares, render)

  const protectedRoute = (url, ...middlewares) =>
    route(url, protect, ...middlewares)

  const publicRoute = route

  const wrap = (segment, wrapper = protectedRoute) => (url, ...args) =>
    wrapper(`${segment}${url || ''}`, ...args)

  const companyLevel = wrap('/c(ompany)?/:company')
  const workspaceLevel = wrap('/w(orkspace)?/:workspace', companyLevel)
  const folderLevel = wrap('/f(older)?/:folder', workspaceLevel)

  return {
    protectedRoute,
    publicRoute,
    ensureLoad,
    companyLevel,
    workspaceLevel,
    folderLevel
  }
}

const _ = bind.placeholder
const campaignsWithAdsets = bind(campaigns, null, _, _, 'include-adsets')

export function setAppRoutes (app, render) {
  const {
    publicRoute,
    protectedRoute,
    ensureLoad,
    companyLevel,
    workspaceLevel,
    folderLevel
  } = getHelpers(app, render)

  publicRoute('/expired/report/:reportShare')
  publicRoute('/mailing/:mailing/unsubscribe/:email', preload(unsub))

  publicRoute('/share/report/:reportShare',
    allowGuestMiddleware,
    protectSharedReportMiddleware,
    preload(statuses, reportShareMetaData, reportShare))

  protectedRoute('/', ensureLoad())

  companyLevel('', ensureLoad(workspaces))
  companyLevel('/mailing/:mailing?',
    ensureLoad(mailings))

  companyLevel('/reports',
    ensureLoad(savedAccounts, reports))

  companyLevel('/reports/new',
    ensureLoad(savedAccounts, reports))

  companyLevel('/r(eport)?/:report',
    ensureLoad(savedAccounts, report))

  companyLevel('/r(eport)?/:report/edit',
    ensureLoad(savedAccounts, report))

  companyLevel('/r(eport)?/:report/mailing/:mailing?',
    ensureLoad(savedAccounts, report, mailings))

  companyLevel('/orders',
    ensureLoad(orders))

  companyLevel('/orders',
    ensureLoad(orders))

  companyLevel('/orders/clone',
    ensureLoad(orders))

  companyLevel('/create/workspace',
    ensureLoad(roles))

  workspaceLevel('',
    ensureLoad(workspace, folders))

  workspaceLevel('/reports',
    ensureLoad(workspace, reports))

  workspaceLevel('/reports/new',
    ensureLoad(workspace, reports))

  workspaceLevel('/r(eport)?/:report',
    ensureLoad(workspace, report))

  workspaceLevel('/r(eport)?/:report/edit',
    ensureLoad(workspace, report))

  workspaceLevel('/r(eport)?/:report/mailing/:mailing?',
    ensureLoad(workspace, report, mailings))

  workspaceLevel('/orders',
    ensureLoad(workspace, orders))

  workspaceLevel('/orders/clone',
    ensureLoad(workspace, orders))

  workspaceLevel('/edit',
    ensureLoad(roles, workspace))

  workspaceLevel('/create/folder',
    ensureLoad(workspace, accounts))

  forEach(subAccountRoutes, section =>
    folderLevel(`/account${section}`,
      ensureLoad(workspace, folder)))

  const subFolderActions = [workspace, folder, campaigns]

  folderLevel('',
    ensureLoad(...subFolderActions))

  folderLevel('/edit',
    ensureLoad(...subFolderActions, accounts))

  folderLevel('/create/campaign',
    ensureLoad(...subFolderActions))

  folderLevel('/reports',
    ensureLoad(...subFolderActions, reports))

  folderLevel('/reports/new',
    ensureLoad(...subFolderActions, reports))

  folderLevel('/r(eport)?/:report',
    ensureLoad(...subFolderActions, report))

  folderLevel('/r(eport)?/:report/edit',
    ensureLoad(...subFolderActions, report))

  folderLevel('/r(eport)?/:report/mailing/:mailing?',
    ensureLoad(...subFolderActions, report, mailings))

  folderLevel('/creatives',
    ensureLoad(...subFolderActions))

  forEach(subCampaignRoutes, path =>
    folderLevel(`/c(ampaign)/:campaign${path}`,
      ensureLoad(...subFolderActions)))

  folderLevel('/orders',
    ensureLoad(workspace, folder, orders))

  folderLevel('/orders/clone',
    ensureLoad(workspace, folder, orders))

  folderLevel('/o(rder)?/:order',
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets))

  folderLevel('/o(rder)?/:order/budget/:budget',
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets))

  folderLevel('/o(rder)?/:order/autobudget',
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets, autoBudgetLogs))

  folderLevel('/o(rder)?/:order/autobudget/:day',
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders, budgets, autoBudgetLogs))

  folderLevel('/create/order',
    ensureLoad(deliveryMethods, workspace, folder, campaignsWithAdsets, orders))
}
