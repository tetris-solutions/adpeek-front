import React from 'react'
import CampaignAdGroup from './CampaignAdGroup'
import {loadCampaignAdGroupsAction} from '../actions/load-adgroups'
import {loadCampaignAdGroupAdsAction} from '../actions/load-adgroup-ads'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import size from 'lodash/size'

const isBrowser = typeof window !== 'undefined'
const style = csjs`
.wrapper {
  overflow: auto;
  min-height: 40vh;
}
.grid {
}
.column {
  display: block;
  float: left;
  width: 280px;
  padding: 10px 10px 0 10px;
}`

const {PropTypes} = React

export const CampaignAdGroups = React.createClass({
  displayName: 'Campaign-AdGroups',
  mixins: [styled(style)],
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      platform: PropTypes.string,
      ads: PropTypes.array
    }),
    params: PropTypes.object
  },
  componentDidMount () {
    this.loadAdGroups()
  },
  loadAdGroups () {
    const {dispatch, params} = this.props

    return dispatch(loadCampaignAdGroupsAction,
      params.company,
      params.workspace,
      params.folder,
      params.campaign)
  },
  loadAdGroupAds (adGroup) {
    if (!this.loadAdsPromise) {
      this.loadAdsPromise = Promise.resolve()
    }

    this.loadAdsPromise = this.loadAdsPromise.then(() => {
      const {dispatch, params} = this.props

      return dispatch(loadCampaignAdGroupAdsAction,
        params.company,
        params.workspace,
        params.folder,
        params.campaign,
        adGroup)
    })
  },
  render () {
    const {campaign} = this.props
    const gridStyle = {}

    if (isBrowser) {
      gridStyle.width = Math.max(size(campaign.adGroups) + 20, window.innerWidth) + 'px'
    }

    return (
      <section className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div className={`${style.wrapper}`}>
            <div className={`${style.grid}`} ref='grid' style={gridStyle}>
              {map(campaign.adGroups,
                adGroup => (
                  <div className={`${style.column}`}>
                    <CampaignAdGroup
                      key={adGroup.id}
                      loadAdGroupAds={this.loadAdGroupAds}
                      adGroup={adGroup}/>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
})

export default CampaignAdGroups
