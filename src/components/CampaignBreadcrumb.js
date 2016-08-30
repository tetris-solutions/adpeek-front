import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function CampaignBreadcrumb ({params: {company, workspace, folder}, campaign}, {messages: {campaignBreadcrumb}}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${campaign.id}`} title={campaignBreadcrumb}>
      <i className='material-icons'>format_shapes</i>
      {campaign.name}
    </Link>
  )
}

CampaignBreadcrumb.displayName = 'Campaign-Breadcrumb'
CampaignBreadcrumb.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}
CampaignBreadcrumb.contextTypes = {
  messages: PropTypes.object
}

export default contextualize(CampaignBreadcrumb, 'campaign')
