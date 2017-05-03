import React from 'react'
import PropTypes from 'prop-types'

const AdwordsCampaign = ({campaign}) => (
  <pre>{JSON.stringify(campaign.details, null, 2)}</pre>
)

AdwordsCampaign.propTypes = {
  params: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default AdwordsCampaign
