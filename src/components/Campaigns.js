import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'

const {PropTypes} = React

function Campaigns ({params: {company, workspace}}, {folder}) {
  return (
    <div>
      <ul>
        {map(folder.availableCampaigns, ({name}, index) => (
          <li key={index}>{name}</li>
        ))}
        <li>
          <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/create/campaign`}>
            CREATE NEW
          </Link>
        </li>
      </ul>
    </div>
  )
}

Campaigns.displayName = 'Campaigns'
Campaigns.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}
Campaigns.contextTypes = {
  folder: PropTypes.object
}

export default Campaigns
