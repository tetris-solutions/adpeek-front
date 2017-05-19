import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Tab, Tabs} from '../../Tabs'
import startsWith from 'lodash/startsWith'
import noop from 'lodash/noop'
import Location from './Location'
import Proximity from './Proximity'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import map from 'lodash/map'
import concat from 'lodash/concat'
import {Submit, Button} from '../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import {updateCampaignLocationAction} from '../../../actions/update-campaign-location'
import {updateCampaignProximityAction} from '../../../actions/update-campaign-proximity'

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
}`

const NEW_POINT_PREFIX = '__NEW__.'

const preparePoint = point =>
  assign({}, point, {
    id: startsWith(point.id, NEW_POINT_PREFIX) ? null : point.id
  })

const normalizeLocation = ({id, location: name, location_type: type}) => ({id, name, type})
const normalizeProximity = ({id, geo_point: {latitudeInMicroDegrees, longitudeInMicroDegrees}, radius, radius_unit: unit, address}) => ({
  id,
  lat: latitudeInMicroDegrees / Math.pow(10, 6),
  lng: longitudeInMicroDegrees / Math.pow(10, 6),
  radius,
  unit,
  address
})

const isLocation = {type: 'LOCATION'}
const isProximity = {type: 'PROXIMITY'}

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
    activeTab: 'location-criteria',
    locations: map(filter(this.props.campaign.details.criteria, isLocation), normalizeLocation),
    points: map(filter(this.props.campaign.details.criteria, isProximity), normalizeProximity)
  }

  removeLocation = ({id}) => {
    this.setState({
      locations: filter(this.state.locations, location => location.id !== id)
    })
  }

  addLocation = location => {
    this.setState({
      locations: concat(this.state.locations, location)
    })
  }

  onSubmit = e => {
    e.preventDefault()

    const {dispatch, params, onSubmit} = this.props
    const {locations, points} = this.state

    Promise.all([
      dispatch(updateCampaignLocationAction, params, locations),
      dispatch(updateCampaignProximityAction, params, map(points, preparePoint))
    ]).then(onSubmit)
  }

  addPoint = () => {
    this.setState({
      points: concat(this.state.points, {
        id: NEW_POINT_PREFIX + Math.random().toString(36).substr(2),
        unit: 'KILOMETERS',
        radius: 5
      })
    })
  }

  updatePoint = changes => {
    const id = this.getSelectedPoint()

    this.setState({
      points: map(this.state.points, point =>
        point.id === id
          ? assign({}, point, changes)
          : point)
    })
  }

  removePoint = () => {
    const id = this.getSelectedPoint()

    this.setState({
      points: filter(this.state.points, point => point.id !== id)
    })
  }

  cancel = () => {
    this.props.onSubmit(false)
  }

  onChangeTab = (activeTab) => {
    this.setState({activeTab})
  }

  getSelectedPoint () {
    return this.state.activeTab.split('-')[1]
  }

  render () {
    const {messages} = this.context
    const {dispatch} = this.props
    const {points, locations, activeTab} = this.state
    const tab = id => ({id, active: id === activeTab})
    const isPointTab = startsWith(activeTab, 'point-')

    return (
      <form onSubmit={this.onSubmit}>
        <Tabs onChangeTab={this.onChangeTab}>
          <Tab {...tab('location-criteria')} title={messages.locationCriteria}>
            <Location
              dispatch={dispatch}
              add={this.addLocation}
              remove={this.removeLocation}
              locations={locations}/>
          </Tab>

          {map(points, point =>
            <Tab key={point.id} {...tab(`point-${point.id}`)} title={messages.proximityCriteria}>
              <Proximity {...point} update={this.updatePoint}/>
            </Tab>)}
        </Tabs>
        <div className={`${style.actions}`}>
          <Button className='mdl-button mdl-button--raised' onClick={this.cancel}>
            <Message>cancel</Message>
          </Button>

          {isPointTab && (
            <Button
              onClick={this.removePoint}
              className='mdl-button mdl-button--raised mdl-button--accent'>
              <Message>remove</Message>
            </Button>)}

          <Button onClick={this.addPoint} className='mdl-button mdl-button--raised'>
            <Message>addPoint</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </form>
    )
  }
}

export default styledComponent(EditGeoLocation, style)
