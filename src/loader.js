import React from 'react'
import noop from 'lodash/noop'

const screen = (loader, name = null) =>
  (nextState, callback) =>
    loader(comp => callback(null, name
      ? comp[name].default
      : comp.default))

const isServer = typeof document === 'undefined'

if (isServer) {
  /* eslint-disable */
  eval('require.ensure = function (nope, fn) {fn(require);}')
  /* eslint-enable */
}

function bypass (getComponent) {
  let component

  getComponent(null, (_, x) => {
    component = x
  })

  return {component}
}

export const component = isServer
  ? bypass
  : fn => ({
    getComponent (nextState, callback) {
      fn(nextState, callback)
    }
  })

export const piece = (loader, name = null) =>
  React.createClass({
    displayName: 'Piece',
    componentWillMount () {
      if (isServer) {
        this.inject(noop)
      }
    },
    componentDidMount () {
      this.inject(() => this.forceUpdate())
    },
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

const reportSection = render => require.ensure([], require => render({
  folder: require('./components/FolderReport'),
  workspace: require('./components/WorkspaceReport'),
  company: require('./components/CompanyReport'),
  share: require('./components/Report/Share'),
  aside: require('./components/Report/Aside'),
  asideLite: require('./components/Report/AsideLite')
}))

const reportListSection = render => require.ensure([], require => render({
  company: require('./components/CompanyReports'),
  workspace: require('./components/WorkspaceReports'),
  folder: require('./components/FolderReports')
}))

const breadcrumbs = render => require.ensure([], require => render({
  company: require('./components/CompanyBreadcrumb'),
  folder: require('./components/FolderBreadcrumb'),
  workspace: require('./components/WorkspaceBreadcrumb'),
  report: require('./components/Report/Breadcrumb'),
  reports: require('./components/Report/ListBreadcrumb'),
  order: require('./components/OrderBreadcrumb'),
  orders: require('./components/OrdersBreadcrumb')
}))

const campaign = render => require.ensure([], require => render({
  aside: require('./components/CampaignAside'),
  breadcrumb: require('./components/CampaignBreadcrumb')
}))

const orderCloning = render => require.ensure([], require => render({
  folder: require('./components/FolderOrdersCloning'),
  workspace: require('./components/WorkspaceOrdersCloning'),
  company: require('./components/CompanyOrdersCloning')
}))

const creatives = render => require.ensure([], require => render({
  campaign: require('./components/CampaignCreatives'),
  folder: require('./components/FolderCreatives')
}))

const forms = render => require.ensure([], require => render({
  folderCreate: require('./components/FolderCreate'),
  folderEdit: require('./components/FolderEdit'),
  workspaceCreate: require('./components/WorkspaceCreate'),
  workspaceEdit: require('./components/WorkspaceEdit'),
  reportCreate: require('./components/Report/CreateForm')
}))

const companyLevel = render => require.ensure([], require => render({
  aside: require('./components/CompanyAside'),
  workspaces: require('./components/CompanyWorkspaces')
}))

const workspaceLevel = render => require.ensure([], require => render({
  aside: require('./components/WorkspaceAside'),
  folders: require('./components/WorkspaceFolders')
}))

const folderLevel = render => require.ensure([], require => render({
  aside: require('./components/FolderAside'),
  campaigns: require('./components/FolderCampaigns')
}))

const orderList = render => require.ensure([], require => render({
  folder: require('./components/FolderOrders'),
  workspace: require('./components/WorkspaceOrders'),
  company: require('./components/CompanyOrders')
}))

const orderLevel = render => require.ensure([], require => render({
  editor: require('./components/Order'),
  aside: require('./components/OrderAside')
}))

export const load = {
  Unsub: screen(render => require.ensure([], require => render(require('./components/Report/Unsub')))),
  Mailing: screen(render => require.ensure([], require => render(require('./components/Report/Mailing')))),
  Companies: screen(render => require.ensure([], require => render(require('./components/Companies')))),
  OrderAutoBudget: screen(render => require.ensure([], require => render(require('./components/OrderAutoBudget')))),

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
