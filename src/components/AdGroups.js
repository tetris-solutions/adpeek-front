import React from 'react'
import AdGroup from './AdGroup'
import {loadCampaignAdGroupsAction} from '../actions/load-adgroups'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import size from 'lodash/size'
import flatten from 'lodash/flatten'
import settle from 'promise-settle'
import assign from 'lodash/assign'

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

export const AdGroups = React.createClass({
  displayName: '-AdGroups',
  mixins: [styled(style)],
  propTypes: {
    dispatch: PropTypes.func,
    campaigns: PropTypes.array,
    campaign: PropTypes.shape({
      adGroups: PropTypes.array,
      platform: PropTypes.string
    }),
    params: PropTypes.object
  },
  componentWillUnmount () {
    this.dead = true
  },
  componentDidMount () {
    const {dispatch, params} = this.props
    let promise = Promise.resolve()

    const cancelable = fn => (...args) => this.dead
      ? Promise.resolve()
      : fn(...args)

    const preventRace = action => (...args) => {
      const run = cancelable(() => action(...args))

      promise = promise.then(run, run)

      return promise
    }

    const loadAdGroups = preventRace(campaign =>
      dispatch(loadCampaignAdGroupsAction,
        params.company,
        params.workspace,
        params.folder,
        campaign))

    settle(map(this.props.campaigns, ({id}) => loadAdGroups(id)))
  },
  getAdGroups () {
    return flatten(map(this.props.campaigns,
      ({id, adGroups}) => map(adGroups || [],
        adGroup => assign({campaign: id}, adGroup))))
  },
  render () {
    const adGroups = this.getAdGroups()
    const gridStyle = {}

    if (isBrowser) {
      gridStyle.width = (size(adGroups) * 300) + 20
    }

    return (
      <section className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div className={`${style.wrapper}`}>
            <div className={`${style.grid}`} ref='grid' style={gridStyle}>
              {map(adGroups, adGroup => (
                <div key={adGroup.id} className={`${style.column}`}>
                  <AdGroup {...adGroup}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
})

export default AdGroups
