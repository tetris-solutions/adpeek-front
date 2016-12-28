import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

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
  campaign: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string
  })
}
CampaignBreadcrumb.contextTypes = {
  messages: React.PropTypes.object
}

export default contextualize(CampaignBreadcrumb, 'campaign')
