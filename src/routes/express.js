import bind from 'lodash/bind'
import {loadUserCompaniesActionServerAdaptor as companies} from 'tetris-iso/actions'
import {protectedRouteMiddleware as protect, performActionsMiddleware as preload} from 'tetris-iso/server'

import {loadWorkspaceAccountsActionServerAdaptor as accounts} from '../actions/load-accounts'
import {loadAutoBudgetLogsActionServerAdaptor as autoBudgetLogs} from '../actions/load-autobudget-logs'
import {loadBudgetsActionServerAdaptor as budgets} from '../actions/load-budgets'
import {loadFolderCampaignsActionServerAdaptor as campaigns} from '../actions/load-folder-campaigns'
import {loadCompanyRolesActionServerAdaptor as roles} from '../actions/load-company-roles'
import {loadCompanyWorkspacesActionServerAdaptor as workspaces} from '../actions/load-company-workspaces'
import {loadDeliveryMethodsActionServerAdaptor as deliveryMethods} from '../actions/load-delivery-methods'
import {loadFolderActionServerAdaptor as folder} from '../actions/load-folder'
import {loadReportActionServerAdaptor as report} from '../actions/load-report'
import {loadReportsActionServerAdaptor as reports} from '../actions/load-reports'
import {loadWorkspaceFoldersActionServerAdaptor as folders} from '../actions/load-folders'
import {loadMediasActionServerAdaptor as medias} from '../actions/load-medias'
import {loadOrdersActionServerAdaptor as orders} from '../actions/load-orders'
import {loadStatusesActionServerAdaptor as statuses} from '../actions/load-statuses'
import {loadWorkspaceActionServerAdaptor as workspace} from '../actions/load-workspace'

export function setAppRoutes (app, render) {
  const _ = bind.placeholder
  const campaignsWithAdsets = bind(campaigns, null, _, _, 'include-adsets')

  app.get('/',
    protect,
    preload(companies),
    render)

  app.get('/company/:company',
    protect,
    preload(companies, workspaces),
    render)

  app.get('/company/:company/reports',
    protect,
    preload(companies, reports),
    render)

  app.get('/company/:company/reports/new',
    protect,
    preload(companies, reports),
    render)

  app.get('/company/:company/report/:report',
    protect,
    preload(companies, report),
    render)

  app.get('/company/:company/report/:report/edit',
    protect,
    preload(companies, report),
    render)

  app.get('/company/:company/orders',
    protect,
    preload(companies, orders),
    render)

  app.get('/company/:company/orders',
    protect,
    preload(companies, orders),
    render)

  app.get('/company/:company/orders/clone',
    protect,
    preload(companies, orders),
    render)

  app.get('/company/:company/create/workspace',
    protect,
    preload(companies, roles),
    render)

  app.get('/company/:company/workspace/:workspace',
    protect,
    preload(companies, workspace, folders),
    render)

  app.get('/company/:company/workspace/:workspace/reports',
    protect,
    preload(companies, workspace, reports),
    render)

  app.get('/company/:company/workspace/:workspace/reports/new',
    protect,
    preload(companies, workspace, reports),
    render)

  app.get('/company/:company/workspace/:workspace/report/:report',
    protect,
    preload(companies, workspace, report),
    render)

  app.get('/company/:company/workspace/:workspace/report/:report/edit',
    protect,
    preload(companies, workspace, report),
    render)

  app.get('/company/:company/workspace/:workspace/orders',
    protect,
    preload(companies, workspace, orders),
    render)

  app.get('/company/:company/workspace/:workspace/orders/clone',
    protect,
    preload(companies, workspace, orders),
    render)

  app.get('/company/:company/workspace/:workspace/edit',
    protect,
    preload(companies, roles, workspace),
    render)

  app.get('/company/:company/workspace/:workspace/create/folder',
    protect,
    preload(medias, companies, workspace, accounts),
    render)

  const subFolderActions = [statuses, companies, workspace, folder, campaigns]

  app.get('/company/:company/workspace/:workspace/folder/:folder',
    protect,
    preload(...subFolderActions),
    render)

  subFolderActions.push(reports)

  app.get('/company/:company/workspace/:workspace/folder/:folder/reports',
    protect,
    preload(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/reports/new',
    protect,
    preload(...subFolderActions),
    render)

  subFolderActions.pop()
  subFolderActions.push(report)

  app.get('/company/:company/workspace/:workspace/folder/:folder/report/:report',
    protect,
    preload(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/report/:report/edit',
    protect,
    preload(...subFolderActions),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/creatives',
    protect,
    preload(statuses, companies, workspace, folder, campaigns),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/campaign/:campaign/creatives',
    protect,
    preload(statuses, companies, workspace, folder, campaigns),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/orders',
    protect,
    preload(companies, workspace, folder, orders),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/orders/clone',
    protect,
    preload(companies, workspace, folder, orders),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/order/:order',
    protect,
    preload(deliveryMethods, statuses, companies, workspace, folder, campaignsWithAdsets, orders, budgets),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/order/:order/autobudget',
    protect,
    preload(deliveryMethods, statuses, companies, workspace, folder, campaignsWithAdsets, orders, budgets, autoBudgetLogs),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/order/:order/autobudget/:day',
    protect,
    preload(deliveryMethods, statuses, companies, workspace, folder, campaignsWithAdsets, orders, budgets, autoBudgetLogs),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/create/order',
    protect,
    preload(deliveryMethods, statuses, companies, workspace, folder, campaignsWithAdsets, orders),
    render)

  app.get('/company/:company/workspace/:workspace/folder/:folder/edit',
    protect,
    preload(medias, companies, workspace, accounts, folder),
    render)
}
