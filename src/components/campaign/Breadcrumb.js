import React from 'react'
import PropTypes from 'prop-types'
import Link from '../BreadcrumbLink'
import {routeParamsBasedBranch} from '../higher-order/branch'

export const CampaignBreadcrumb = ({params: {company, workspace, folder}, campaign}, {messages: {campaignBreadcrumb}}) => (
  <Link
    to={`/c/${company}/w/${workspace}/f/${folder}/campaign/${campaign.id}`}
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

export default routeParamsBasedBranch('folder', 'campaign', CampaignBreadcrumb)
