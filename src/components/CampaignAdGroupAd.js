import React from 'react'

const {PropTypes} = React

const AdGroupAd = ({id, headline}) => (
  <li key={id}>{headline}</li>
)

AdGroupAd.displayName = 'AdGroup-Ad'
AdGroupAd.propTypes = {
  id: PropTypes.string,
  headline: PropTypes.string
}

export default AdGroupAd
