import React from 'react'
import Header from './Header'
import SideNav from './SideNav'
import {contextualize} from './higher-order/contextualize'
import Helmet from 'react-helmet'
import join from 'lodash/join'
import filter from 'lodash/filter'
const {PropTypes} = React

function _Title ({report, order, campaign, folder, workspace, company}) {
  const parts = [
    'Tetris Solutions',
    'AdPeek',
    company && company.name,
    workspace && workspace.name,
    folder && folder.name,
    campaign && campaign.name,
    order && order.name,
    report && report.name
  ].reverse()

  return <Helmet title={join(filter(parts), ' < ')}/>
}

_Title.displayName = 'Title'
_Title.propTypes = {
  report: PropTypes.object,
  order: PropTypes.object,
  campaign: PropTypes.object,
  folder: PropTypes.object,
  workspace: PropTypes.object,
  company: PropTypes.object
}

const Title = contextualize(_Title, 'order', 'report', 'campaign', 'folder', 'workspace', 'company')

const App = ({children}) => (
  <div className='mdl-layout__container'>
    <Title/>
    <div className='mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded'>
      <Header />
      <SideNav />
      <main className='mdl-layout__content mdl-color--grey-100'>
        {children}
      </main>
    </div>
    <div className='mdl-layout__obfuscator'/>
  </div>
)

App.displayName = 'App'
App.propTypes = {
  children: PropTypes.node
}

export default App
