import React from 'react'
import PropTypes from 'prop-types'
import Link from '../BreadcrumbLink'
import {node} from '../higher-order/branch'

export const CampaignBreadcrumb = ({params: {company, workspace, folder}, campaign}, {messages: {campaignBreadcrumb}}) => (
  <Link
    to={`/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${campaign.id}`}
    title={campaignBreadcrumb}>
    <i className='material-icons'>format_shapes</i>
    {campaign.name}
  </Link>
)

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

export default node('folder', 'campaign', CampaignBreadcrumb)
