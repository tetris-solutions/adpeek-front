import React from 'react'
import {Link} from 'react-router'
import {node} from './higher-order/branch'

export const CampaignBreadcrumb = ({params: {company, workspace, folder}, campaign}, {messages: {campaignBreadcrumb}}) =>
  <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${campaign.id}`} title={campaignBreadcrumb}>
    <i className='material-icons'>format_shapes</i>
    {campaign.name}
  </Link>

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

export default node('folder', 'campaign', CampaignBreadcrumb)
