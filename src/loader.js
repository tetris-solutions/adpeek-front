import React from 'react'
import noop from 'lodash/noop'

const screen = (loader, name = null) =>
  (nextState, callback) =>
    loader(comp => callback(null, name
      ? comp[name].default
      : comp.default))

// const isServer = typeof document === 'undefined'

// if (isServer) {
// eslint-disable
// eval('require.ensure = function (nope, fn) {fn(require);}')
// eslint-enable
// }

function bypass (getComponent) {
  let component

  getComponent(null, (_, x) => {
    component = x
  })

  return {component}
}

export const render = bypass

const tempSyncEnsure = fn => fn()

// export const render = isServer
//   ? bypass
//   : fn => ({
//     getComponent (nextState, callback) {
//       fn(nextState, callback)
//     }
//   })

export const piece = (loader, name = null) =>
  React.createClass({
    displayName: 'Piece',
    componentWillMount () {
      this.inject(noop)
      // if (isServer) {
      //   this.inject(noop)
      // }
    },
    // componentDidMount () {
    //   this.inject(() => this.forceUpdate())
    // },
    inject (callback) {
      loader(comp => {
        this.Component = name
          ? comp[name].default
          : comp.default

        callback()
      })
    },
    render () {
      const {Component} = this

      return Component ? <Component {...this.props}/> : null
    }
  })

const reportSection = provide => tempSyncEnsure(() => provide({
  folder: require('./components/FolderReport'),
  workspace: require('./components/WorkspaceReport'),
  company: require('./components/CompanyReport'),
  share: require('./components/Report/Share'),
  aside: require('./components/Report/Aside'),
  asideLite: require('./components/Report/AsideLite')
}))

const reportListSection = provide => tempSyncEnsure(() => provide({
  company: require('./components/CompanyReports'),
  workspace: require('./components/WorkspaceReports'),
  folder: require('./components/FolderReports')
}))

const breadcrumbs = provide => tempSyncEnsure(() => provide({
  company: require('./components/CompanyBreadcrumb'),
  folder: require('./components/FolderBreadcrumb'),
  workspace: require('./components/WorkspaceBreadcrumb'),
  report: require('./components/Report/Breadcrumb'),
  reports: require('./components/Report/ListBreadcrumb'),
  order: require('./components/OrderBreadcrumb'),
  orders: require('./components/OrdersBreadcrumb')
}))

const campaign = provide => tempSyncEnsure(() => provide({
  aside: require('./components/CampaignAside'),
  breadcrumb: require('./components/CampaignBreadcrumb')
}))

const orderCloning = provide => tempSyncEnsure(() => provide({
  folder: require('./components/FolderOrdersCloning'),
  workspace: require('./components/WorkspaceOrdersCloning'),
  company: require('./components/CompanyOrdersCloning')
}))

const creatives = provide => tempSyncEnsure(() => provide({
  campaign: require('./components/CampaignCreatives'),
  folder: require('./components/FolderCreatives')
}))

const forms = provide => tempSyncEnsure(() => provide({
  folderCreate: require('./components/FolderCreate'),
  folderEdit: require('./components/FolderEdit'),
  workspaceCreate: require('./components/WorkspaceCreate'),
  workspaceEdit: require('./components/WorkspaceEdit'),
  reportCreate: require('./components/Report/CreateForm')
}))

const companyLevel = provide => tempSyncEnsure(() => provide({
  aside: require('./components/CompanyAside'),
  workspaces: require('./components/CompanyWorkspaces/List')
}))

const workspaceLevel = provide => tempSyncEnsure(() => provide({
  aside: require('./components/WorkspaceAside'),
  folders: require('./components/WorkspaceFolders')
}))

const folderLevel = provide => tempSyncEnsure(() => provide({
  aside: require('./components/FolderAside'),
  campaigns: require('./components/FolderCampaigns')
}))

const orderList = provide => tempSyncEnsure(() => provide({
  folder: require('./components/FolderOrders'),
  workspace: require('./components/WorkspaceOrders'),
  company: require('./components/CompanyOrders')
}))

const orderLevel = provide => tempSyncEnsure(() => provide({
  editor: require('./components/Order'),
  aside: require('./components/OrderAside')
}))

const unsub = provide => tempSyncEnsure(() =>
  provide(require('./components/Report/Unsub')))

const mailing = provide => tempSyncEnsure(() =>
  provide(require('./components/Report/Mailing')))

const companies = provide => tempSyncEnsure(() =>
  provide(require('./components/Companies')))

const autoBudget = provide => tempSyncEnsure(() =>
  provide(require('./components/OrderAutoBudget')))

export const component = {
  Unsub: screen(unsub),
  Mailing: screen(mailing),
  Companies: screen(companies),
  OrderAutoBudget: screen(autoBudget),

  FolderReport: screen(reportSection, 'folder'),
  WorkspaceReport: screen(reportSection, 'workspace'),
  CompanyReport: screen(reportSection, 'company'),
  ReportShare: screen(reportSection, 'share'),
  ReportAside: piece(reportSection, 'aside'),
  ReportAsideLite: piece(reportSection, 'asideLite'),

  CompanyReports: screen(reportListSection, 'company'),
  WorkspaceReports: screen(reportListSection, 'workspace'),
  FolderReports: screen(reportListSection, 'folder'),

  OrderBreadCrumb: piece(breadcrumbs, 'order'),
  OrdersBreadCrumb: piece(breadcrumbs, 'orders'),
  ReportBreadcrumb: piece(breadcrumbs, 'report'),
  ReportsBreadcrumb: piece(breadcrumbs, 'reports'),
  CompanyBreadcrumb: piece(breadcrumbs, 'company'),
  WorkspaceBreadcrumb: piece(breadcrumbs, 'workspace'),
  FolderBreadcrumb: piece(breadcrumbs, 'folder'),

  CompanyOrdersCloning: screen(orderCloning, 'company'),
  WorkspaceOrdersCloning: screen(orderCloning, 'workspace'),
  FolderOrdersCloning: screen(orderCloning, 'folder'),

  CampaignCreatives: screen(creatives, 'campaign'),
  FolderCreatives: screen(creatives, 'folder'),

  WorkspaceCreate: screen(forms, 'workspaceCreate'),
  WorkspaceEdit: screen(forms, 'workspaceEdit'),
  FolderCreate: screen(forms, 'folderCreate'),
  FolderEdit: screen(forms, 'folderEdit'),
  ReportCreate: screen(forms, 'reportCreate'),

  CampaignBreadcrumb: piece(campaign, 'breadcrumb'),
  CampaignAside: piece(campaign, 'aside'),

  CompanyWorkspaces: screen(companyLevel, 'workspaces'),
  CompanyAside: piece(companyLevel, 'aside'),

  WorkspaceFolders: screen(workspaceLevel, 'folders'),
  WorkspaceAside: piece(workspaceLevel, 'aside'),

  FolderCampaigns: screen(folderLevel, 'campaigns'),
  FolderAside: piece(folderLevel, 'aside'),

  FolderOrders: screen(orderList, 'folder'),
  WorkspaceOrders: screen(orderList, 'workspace'),
  CompanyOrders: screen(orderList, 'company'),

  Order: screen(orderLevel, 'editor'),
  OrderAside: piece(orderLevel, 'aside')
}
