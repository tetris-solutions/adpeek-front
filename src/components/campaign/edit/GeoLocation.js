import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import CriteriaRow from './CriteriaRow'
import noop from 'lodash/noop'
import keyBy from 'lodash/keyBy'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import map from 'lodash/map'
import concat from 'lodash/concat'
import {Submit, Button} from '../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import {updateCampaignLocationAction} from '../../../actions/update-campaign-location'
import {updateCampaignProximityAction} from '../../../actions/update-campaign-proximity'
import floor from 'lodash/floor'
import Form from '../../Form'
import isEmpty from 'lodash/isEmpty'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}
.actions > button:not(:first-child) {
  margin-left: .5em;
}
.tableWrapper {
  height: 40vh;
}
.tableWrapper > table {
  width: 100%;
}`

const preparePoint = point =>
  assign({}, point, {
    id: point.draft ? null : point.id,
    lat: floor(point.lat * Math.pow(10, 6)),
    lng: floor(point.lng * Math.pow(10, 6))
  })

const normalizeLocation = ({id, location: name, location_type, type, bid_modifier}) => ({
  id,
  name,
  location_type,
  type,
  bid_modifier
})

const normalizeProximity = ({id, geo_point, radius, radius_unit: unit, address, bid_modifier, type}) => ({
  id,
  lat: geo_point.latitudeInMicroDegrees / Math.pow(10, 6),
  lng: geo_point.longitudeInMicroDegrees / Math.pow(10, 6),
  radius,
  type,
  location_type: 'Proximity',
  unit,
  address,
  bid_modifier
})

const isLocation = ({type}) => type === 'LOCATION' || type === 'PROXIMITY'

const normalize = criteria => criteria.type === 'LOCATION'
  ? normalizeLocation(criteria)
  : normalizeProximity(criteria)

class EditGeoLocation extends React.Component {
  static displayName = 'Edit-Geo-Location'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func
  }

  static defaultProps = {
    onSubmit: noop
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    createModalOpen: false,
    criteria: map(filter(this.props.campaign.details.criteria, isLocation), normalize)
  }

  componentWillMount () {
    if (isEmpty(this.state.criteria)) {
      this.setState({createModalOpen: true})
    }
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props
    const criteria = keyBy(this.state.criteria, 'type')

    return Promise.all([
      dispatch(updateCampaignLocationAction, params, criteria.LOCATION || []),
      dispatch(updateCampaignProximityAction, params, map(criteria.PROXIMITY, preparePoint))
    ]).then(onSubmit)
  }

  addPoint = () => {
    const id = Math.random().toString(36).substr(2)

    this.setState({
      points: concat(this.state.points, {
        id,
        draft: true,
        unit: 'KILOMETERS',
        radius: 5
      })
    })
  }

  addCriteria = criteria => {
    this.setState({
      criteria: concat(this.state.criteria, criteria)
    })
  }

  updateCriteria = (id, changes) => {
    this.setState({
      criteria: map(this.state.criteria, item =>
        item.id === id
          ? assign({}, item, changes)
          : item)
    })
  }

  removeCriteria = id => {
    this.setState({
      criteria: filter(this.state.criteria, criteria => criteria.id !== id)
    })
  }

  cancel = () => {
    this.props.onSubmit(false)
  }

  toggleCreationModal = () => {
    this.setState({
      createModalOpen: !this.state.createModalOpen
    })
  }

  render () {
    const {criteria} = this.state

    return (
      <Form onSubmit={this.save}>
        <div className={style.tableWrapper}>
          <table className='mdl-data-table'>
            <thead>
              <tr>
                <th className='mdl-data-table__cell--non-numeric'>
                  <Message>locationDescription</Message>
                </th>
                <th className='mdl-data-table__cell--non-numeric'>
                  <Message>locationType</Message>
                </th>
                <th>
                  <Message>bidModifier</Message>
                </th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {map(criteria, criteria =>
                <CriteriaRow
                  key={criteria.id}
                  {...criteria}
                  remove={this.removeCriteria}
                  change={this.updateCriteria}/>)}
            </tbody>
          </table>
        </div>
        <div className={`${style.actions}`}>
          <Button className='mdl-button mdl-button--raised' onClick={this.cancel}>
            <Message>cancel</Message>
          </Button>

          <Button onClick={this.toggleCreationModal} className='mdl-button mdl-button--raised'>
            <Message>newLocation</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditGeoLocation, style)
