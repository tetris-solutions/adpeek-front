import bind from 'lodash/bind'
import forEach from 'lodash/forEach'
import {protectedRouteMiddleware as protect, performActionsMiddleware as preload} from '@tetris/front-server/server'
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
const _ = bind.placeholder
const campaigns_ = bind(campaigns, null, _, _, 'include-adsets')

const baseActions = [
  statuses, medias, companies
]
const workspaceActions = [
  workspace, folders
]
const folderActions = [
  workspace, folder, campaigns
]
const orderActions = [
  deliveryMethods,
  workspace, folder, campaigns_, orders, budgets
]

const bypass = (req, res, next) => next()

export function setAppRoutes (app, render) {
  const route = (url, isProtected, ...middlewares) =>
    app.get(url,
      isProtected ? protect : bypass,
      shortenUrlMiddleware,
      preload(...baseActions),
      ...middlewares,
      render)

  const protectedRoute = (url, ...middlewares) =>
    route(url, true, ...middlewares)

  const publicRoute = (url, ...middlewares) =>
    route(url, false, ...middlewares)

  const wrap = (segment, wrapper = protectedRoute) =>
    (url, ...middlewares) =>
      wrapper(`${segment}${url || ''}`, ...middlewares)

  const companyLevel = wrap('/c(ompany)?/:company')

  const workspaceLevel = wrap('/w(orkspace)?/:workspace', companyLevel)
  const folderLevel = wrap('/f(older)?/:folder', workspaceLevel)

  publicRoute('/expired/report/:reportShare')
  publicRoute('/mailing/:mailing/unsubscribe/:email',
    preload(unsub))

  publicRoute('/share/report/:reportShare',
    allowGuestMiddleware,
    protectSharedReportMiddleware,
    preload(statuses, reportShareMetaData, reportShare))

  protectedRoute('/')

  companyLevel('',
    preload(workspaces))

  companyLevel('/mailing/:mailing?',
    preload(mailings))

  companyLevel('/reports',
    preload(savedAccounts, reports))

  companyLevel('/reports/new',
    preload(savedAccounts, reports))

  companyLevel('/r(eport)?/:report',
    preload(savedAccounts, report))

  companyLevel('/r(eport)?/:report/edit',
    preload(savedAccounts, report))

  companyLevel('/r(eport)?/:report/mailing/:mailing?',
    preload(savedAccounts, report, mailings))

  companyLevel('/orders',
    preload(orders))

  companyLevel('/orders',
    preload(orders))

  companyLevel('/orders/clone',
    preload(orders))

  companyLevel('/create/workspace',
    preload(roles))

  workspaceLevel('',
    preload(...workspaceActions))

  workspaceLevel('/reports',
    preload(...workspaceActions, reports))

  workspaceLevel('/reports/new',
    preload(...workspaceActions, reports))

  workspaceLevel('/r(eport)?/:report',
    preload(...workspaceActions, report))

  workspaceLevel('/r(eport)?/:report/edit',
    preload(...workspaceActions, report))

  workspaceLevel('/r(eport)?/:report/mailing/:mailing?',
    preload(...workspaceActions, report, mailings))

  workspaceLevel('/orders',
    preload(...workspaceActions, orders))

  workspaceLevel('/orders/clone',
    preload(...workspaceActions, orders))

  workspaceLevel('/edit',
    preload(...workspaceActions, roles))

  workspaceLevel('/create/folder',
    preload(...workspaceActions, accounts))

  folderLevel('',
    preload(...folderActions))

  forEach(subAccountRoutes, section =>
    folderLevel(`/account${section}`,
      preload(...folderActions)))

  folderLevel('/edit',
    preload(...folderActions, accounts))

  folderLevel('/create/campaign',
    preload(...folderActions))

  folderLevel('/reports',
    preload(...folderActions, reports))

  folderLevel('/reports/new',
    preload(...folderActions, reports))

  folderLevel('/r(eport)?/:report',
    preload(...folderActions, report))

  folderLevel('/r(eport)?/:report/edit',
    preload(...folderActions, report))

  folderLevel('/r(eport)?/:report/mailing/:mailing?',
    preload(...folderActions, report, mailings))

  folderLevel('/creatives',
    preload(...folderActions))

  forEach(subCampaignRoutes, path =>
    folderLevel(`/c(ampaign)/:campaign${path}`,
      preload(...folderActions)))

  folderLevel('/orders',
    preload(...folderActions, orders))

  folderLevel('/orders/clone',
    preload(...folderActions, orders))

  folderLevel('/o(rder)?/:order',
    preload(...orderActions))

  folderLevel('/o(rder)?/:order/budget/:budget',
    preload(...orderActions))

  folderLevel('/o(rder)?/:order/autobudget',
    preload(...orderActions, autoBudgetLogs))

  folderLevel('/o(rder)?/:order/autobudget/:day',
    preload(...orderActions, autoBudgetLogs))

  folderLevel('/create/order',
    preload(...orderActions.slice(0, -2), orders))
}
