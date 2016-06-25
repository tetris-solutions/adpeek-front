import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function CampaignBreadcrumb ({params: {company, workspace, folder}, campaign}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${campaign.id}`}>
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

export default contextualize(CampaignBreadcrumb, 'campaign')
