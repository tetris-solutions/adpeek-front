import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Helmet from 'react-helmet'
import join from 'lodash/join'
import compact from 'lodash/compact'

const {PropTypes} = React

function DocTitle ({report, order, campaign, folder, workspace, company}) {
  const parts = [
    'Tetris Solutions',
    'Manager',
    company && company.name,
    workspace && workspace.name,
    folder && folder.name,
    campaign && campaign.name,
    order && order.name,
    report && report.name
  ].reverse()

  return <Helmet title={join(compact(parts), ' - ')}/>
}

DocTitle.displayName = 'Title'
DocTitle.propTypes = {
  report: PropTypes.object,
  order: PropTypes.object,
  campaign: PropTypes.object,
  folder: PropTypes.object,
  workspace: PropTypes.object,
  company: PropTypes.object
}

export default contextualize(DocTitle, 'order', 'report', 'campaign', 'folder', 'workspace', 'company')
