import React from 'react'
import {IndexRoute, Route} from 'react-router'
import {root} from 'baobab-react/dist-modules/higher-order'
import {root as createRoot} from '@tetris/front-server/lib/higher-order/root'
import Home from '../components/Home'
// import Header from '../components/Header'
import App from '../components/App'
import {loadUserCompaniesActionRouterAdaptor} from '@tetris/front-server/lib/actions/load-user-companies-action'

function Header () {
  return null
}

export function getRoutes (tree, protectRoute, preload) {
  return (
    <Route path='/' component={root(tree, createRoot(Header))}>
      <IndexRoute component={Home}/>
      <Route onEnter={protectRoute}>
        <Route path='company/:company' component={App} onEnter={preload(loadUserCompaniesActionRouterAdaptor)}/>
      </Route>
    </Route>
  )
}
