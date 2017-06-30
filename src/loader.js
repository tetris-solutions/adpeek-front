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

export const piece = (loader, name = null) => class extends React.Component {
  static displayName = 'Piece'

  componentWillMount () {
    this.inject(noop)
    // if (isServer) {
    //   this.inject(noop)
    // }
  }

  // componentDidMount () {
  //   this.inject(() => this.forceUpdate())
  // },
  inject = (callback) => {
    loader(comp => {
      this.Component = name
        ? comp[name].default
        : comp.default

      callback()
    })
  }

  render () {
    const {Component} = this

    return Component ? <Component {...this.props}/> : null
  }
}

const reportSection = provide => tempSyncEnsure(() => provide({
  folder: require('./components/folder/Report'),
  workspace: require('./components/workspace/Report'),
  company: require('./components/company/Report'),
  share: require('./components/report/Share'),
  aside: require('./components/report/Aside'),
  asideLite: require('./components/report/AsideLite')
}))

const breadcrumbs = provide => tempSyncEnsure(() => provide({
  company: require('./components/company/Breadcrumb'),
  folder: require('./components/folder/Breadcrumb'),
  workspace: require('./components/workspace/Breadcrumb'),
  report: require('./components/report/Breadcrumb'),
  reports: require('./components/report/ListBreadcrumb'),
  order: require('./components/order/Breadcrumb'),
  orders: require('./components/order/list/Breadcrumb')
}))

const campaign = provide => tempSyncEnsure(() => provide({
  aside: require('./components/campaign/Aside'),
  breadcrumb: require('./components/campaign/Breadcrumb'),
  home: require('./components/campaign/Home'),
  name: require('./components/campaign/edit/NameModal'),
  status: require('./components/campaign/edit/StatusModal'),
  language: require('./components/campaign/edit/LanguageModal'),
  deliveryMethod: require('./components/campaign/edit/DeliveryMethodModal'),
  network: require('./components/campaign/edit/NetworkModal'),
  geoLocation: require('./components/campaign/edit/GeoLocationModal'),
  optimizationStatus: require('./components/campaign/edit/OptimizationStatusModal'),
  platform: require('./components/campaign/edit/Platform'),
  bidStrategy: require('./components/campaign/edit/BidStrategyModal'),
  siteLinks: require('./components/campaign/edit/SiteLinkModal'),
  callOuts: require('./components/campaign/edit/CalloutModal'),
  apps: require('./components/campaign/edit/AppsModal'),
  locations: require('./components/campaign/edit/LocationsModal'),
  dynamicSearchAds: require('./components/campaign/edit/DynamicSearchAdsModal'),
  create: require('./components/campaign/create/Create'),
  userLists: require('./components/campaign/edit/UserLists')
}))

const orderCloning = provide => tempSyncEnsure(() => provide({
  folder: require('./components/folder/OrderCloning'),
  workspace: require('./components/workspace/OrderCloning'),
  company: require('./components/company/OrderCloning')
}))

const creatives = provide => tempSyncEnsure(() => provide({
  campaign: require('./components/campaign/Creatives'),
  folder: require('./components/folder/Creatives')
}))

const forms = provide => tempSyncEnsure(() => provide({
  folderCreate: require('./components/folder/Create'),
  folderEdit: require('./components/folder/Edit'),
  workspaceCreate: require('./components/workspace/Create'),
  workspaceEdit: require('./components/workspace/Edit'),
  reportCreate: require('./components/report/CreateForm')
}))

const companyLevel = provide => tempSyncEnsure(() => provide({
  aside: require('./components/company/Aside'),
  workspaces: require('./components/company/workspaces/List')
}))

const workspaceLevel = provide => tempSyncEnsure(() => provide({
  aside: require('./components/workspace/Aside'),
  folders: require('./components/workspace/folders/List')
}))

const folderLevel = provide => tempSyncEnsure(() => provide({
  aside: require('./components/folder/Aside'),
  campaigns: require('./components/folder/Home')
}))

const orderLevel = provide => tempSyncEnsure(() => provide({
  editor: require('./components/order/Container'),
  aside: require('./components/order/Aside')
}))

const unsub = provide => tempSyncEnsure(() =>
  provide(require('./components/report/Unsub')))

const expired = provide => tempSyncEnsure(() =>
  provide(require('./components/report/Expired')))

const mailing = provide => tempSyncEnsure(() =>
  provide(require('./components/report/Mailing')))

const shoppingSetup = provide => tempSyncEnsure(() =>
  provide(require('./components/campaign/shopping-setup/Container')))

const companies = provide => tempSyncEnsure(() =>
  provide(require('./components/Companies')))

const autoBudget = provide => tempSyncEnsure(() =>
  provide(require('./components/order/AutoBudget')))

const reportList = provide => tempSyncEnsure(() =>
  provide(require('./components/report/List')))

const orderList = provide => tempSyncEnsure(() =>
  provide(require('./components/order/list/List')))

export const component = {
  Unsub: screen(unsub),
  Expired: screen(expired),
  Mailing: screen(mailing),
  Companies: screen(companies),
  OrderAutoBudget: screen(autoBudget),

  FolderReport: screen(reportSection, 'folder'),
  WorkspaceReport: screen(reportSection, 'workspace'),
  CompanyReport: screen(reportSection, 'company'),
  ReportShare: screen(reportSection, 'share'),
  ReportAside: piece(reportSection, 'aside'),
  ReportAsideLite: piece(reportSection, 'asideLite'),

  ReportList: screen(reportList),

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

  CampaignHome: screen(campaign, 'home'),
  CampaignName: screen(campaign, 'name'),
  CampaignStatus: screen(campaign, 'status'),
  CampaignLanguage: screen(campaign, 'language'),
  CampaignDeliveryMethod: screen(campaign, 'deliveryMethod'),
  CampaignNetwork: screen(campaign, 'network'),
  CampaignGeoLocation: screen(campaign, 'geoLocation'),
  CampaignOptimizationStatus: screen(campaign, 'optimizationStatus'),
  CampaignPlatform: screen(campaign, 'platform'),
  CampaignBidStrategy: screen(campaign, 'bidStrategy'),
  CampaignSiteLinks: screen(campaign, 'siteLinks'),
  CampaignCallOuts: screen(campaign, 'callOuts'),
  CampaignApps: screen(campaign, 'apps'),
  CampaignLocations: screen(campaign, 'locations'),
  CampaignDynamicSearchAds: screen(campaign, 'dynamicSearchAds'),
  CampaignUserLists: screen(campaign, 'userLists'),
  CampaignCreatives: screen(creatives, 'campaign'),
  CreateCampaign: screen(campaign, 'create'),
  FolderCreatives: screen(creatives, 'folder'),
  ShoppingSetup: screen(shoppingSetup),

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

  Orders: screen(orderList),

  Order: screen(orderLevel, 'editor'),
  OrderAside: piece(orderLevel, 'aside')
}
