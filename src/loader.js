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
  reportList: require('./components/Report/ListBreadcrumb')
}))

const orderCloning = render => require.ensure([], require => render({
  folder: require('./components/FolderOrdersCloning'),
  workspace: require('./components/WorkspaceOrdersCloning'),
  company: require('./components/CompanyOrdersCloning')
}))

export const load = {
  App: screen(render => require.ensure([], require => render(require('./components/App')))),
  Unsub: screen(render => require.ensure([], require => render(require('./components/Report/Unsub')))),
  Mailing: screen(render => require.ensure([], require => render(require('./components/Report/Mailing')))),

  FolderReport: screen(reportSection, 'folder'),
  WorkspaceReport: screen(reportSection, 'workspace'),
  CompanyReport: screen(reportSection, 'company'),
  ReportShare: screen(reportSection, 'share'),
  ReportAside: piece(reportSection, 'aside'),
  ReportAsideLite: piece(reportSection, 'asideLite'),

  CompanyReports: screen(reportListSection, 'company'),
  WorkspaceReports: screen(reportListSection, 'workspace'),
  FolderReports: screen(reportListSection, 'folder'),

  ReportBreadcrumb: piece(breadcrumbs, 'report'),
  ReportsBreadcrumb: piece(breadcrumbs, 'reportList'),
  CompanyBreadcrumb: piece(breadcrumbs, 'company'),
  WorkspaceBreadcrumb: piece(breadcrumbs, 'workspace'),
  FolderBreadcrumb: piece(breadcrumbs, 'folder'),

  CompanyOrdersCloning: screen(orderCloning, 'company'),
  WorkspaceOrdersCloning: screen(orderCloning, 'workspace'),
  FolderOrdersCloning: screen(orderCloning, 'folder')
}
