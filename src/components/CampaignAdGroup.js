import React from 'react'
import CampaignAdGroupAd from './CampaignAdGroupAd'
import map from 'lodash/map'

const {PropTypes} = React

export const CampaignAdGroup = React.createClass({
  displayName: 'Campaign-AdGroup',
  propTypes: {
    adGroup: PropTypes.object,
    loadAdGroupAds: PropTypes.func
  },
  contextTypes: {},
  componentDidMount () {
    this.props.loadAdGroupAds(this.props.adGroup.id)
  },
  render () {
    const {adGroup} = this.props
    return (
      <div>
        <h4>{adGroup.name}</h4>
        <hr/>
        <ul>
          {map(adGroup.ads, ad => (
            <CampaignAdGroupAd key={ad.id} {...ad}/>
          ))}
        </ul>
      </div>
    )
  }
})

export default CampaignAdGroup
