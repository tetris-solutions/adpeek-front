import React from 'react'
import CampaignAdGroup from './CampaignAdGroup'
import {loadCampaignAdGroupsAction} from '../actions/load-adgroups'
import {loadCampaignAdGroupAdsAction} from '../actions/load-adgroup-ads'
import {loadCampaignAdGroupKeywordsAction} from '../actions/load-adgroup-keywords'
import delay from 'delay'
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
  display: flex;
}
.column {
  flex: 1;
  overflow: hidden;
  padding: 10px 10px 0 10px;
}`

const {PropTypes} = React

export const CampaignAdGroups = React.createClass({
  displayName: 'Campaign-AdGroups',
  mixins: [styled(style)],
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      adGroups: PropTypes.array,
      platform: PropTypes.string
    }),
    params: PropTypes.object
  },
  componentDidMount () {
    const {dispatch, params} = this.props
    let promise = Promise.resolve()

    const preventRace = fn => (...args) => {
      promise = promise
        .then(() => fn(...args))

      return promise
    }

    const loadAdGroupAds = adGroup =>
      dispatch(loadCampaignAdGroupAdsAction,
        params.company,
        params.workspace,
        params.folder,
        params.campaign,
        adGroup)

    const loadAdGroupKeywords = adGroup =>
      dispatch(loadCampaignAdGroupKeywordsAction,
        params.company,
        params.workspace,
        params.folder,
        params.campaign,
        adGroup)

    const loadAdGroups = () =>
      dispatch(loadCampaignAdGroupsAction,
        params.company,
        params.workspace,
        params.folder,
        params.campaign)

    const loadAdGroupDependencies = preventRace(id =>
      loadAdGroupAds(id)
        .then(() => loadAdGroupKeywords(id)))

    loadAdGroups()
      .then(() => delay(300))
      .then(() => Promise.all(map(this.props.campaign.adGroups, ({id}) => loadAdGroupDependencies(id))))
  },
  render () {
    const {campaign} = this.props
    const gridStyle = {}

    if (isBrowser) {
      gridStyle.width = (size(campaign.adGroups) * 300) + 20
    }

    return (
      <section className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div className={`${style.wrapper}`}>
            <div className={`${style.grid}`} ref='grid' style={gridStyle}>
              {map(campaign.adGroups,
                adGroup => (
                  <div key={adGroup.id} className={`${style.column}`}>
                    <CampaignAdGroup {...adGroup}/>
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
