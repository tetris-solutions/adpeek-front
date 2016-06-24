import React from 'react'
import CampaignAdGroupAd from './CampaignAdGroupAd'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.header {
  font-size: large;
  font-weight: 600;
  padding: .7em 0;
  text-align: center;
  text-shadow: 1px 2px rgba(0, 0, 0, 0.1)
}`
const {PropTypes} = React

export const CampaignAdGroup = React.createClass({
  displayName: 'Campaign-AdGroup',
  mixins: [styled(style)],
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
        <header className={`mdl-color--grey-700 mdl-color-text--white ${style.header}`}>
          {adGroup.name}
        </header>
        <div>
          {map(adGroup.ads, ad => (
            <CampaignAdGroupAd key={ad.id} {...ad}/>
          ))}
        </div>
      </div>
    )
  }
})

export default CampaignAdGroup
