import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Tab, Tabs} from '../../Tabs'
import noop from 'lodash/noop'
import Location from './Location'
import Proximity from './Proximity'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import assign from 'lodash/assign'
import map from 'lodash/map'
import concat from 'lodash/concat'
import {Submit, Button} from '../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import {updateCampaignLocationAction} from '../../../actions/update-campaign-location'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}`

const normalizeLocation = ({id, location: name, location_type: type}) => ({id, name, type})
const normalizeProximity = ({id, geo_point: {latitudeInMicroDegrees: lat, longitudeInMicroDegrees: lng}, radius, radius_unit: unit, address}) => ({
  id,
  lat,
  lng,
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
    locations: map(filter(this.props.campaign.details.criteria, isLocation), normalizeLocation),
    points: map(filter(this.props.campaign.details.criteria, isProximity), normalizeProximity)
  }

  componentWillMount () {
    if (isEmpty(this.state.points)) {
      this.addPoint()
    }
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

    dispatch(updateCampaignLocationAction, params, this.state.locations)
      .then(onSubmit)
  }

  addPoint = () => {
    this.setState({
      points: concat(this.state.points, {
        id: Math.random().toString(36).substr(2),
        unit: 'KILOMETERS'
      })
    })
  }

  updatePoint = (id, changes) => {
    this.setState({
      points: map(this.state.points, point =>
        point.id === id
          ? assign({}, point, changes)
          : point)
    })
  }

  render () {
    const {messages} = this.context
    const {dispatch, onSubmit: close} = this.props
    const {points, locations} = this.state

    return (
      <form onSubmit={this.onSubmit}>
        <Tabs>
          <Tab id='location-criteria' title={messages.locationCriteria}>
            <Location
              dispatch={dispatch}
              add={this.addLocation}
              remove={this.removeLocation}
              locations={locations}/>
          </Tab>

          {map(points, point =>
            <Tab key={point.id} id={`proximity-criteria-${point.id}`} title={messages.proximityCriteria}>
              <Proximity {...point} update={changes => this.updatePoint(point.id, changes)}/>
            </Tab>)}
        </Tabs>
        <div className={`${style.actions}`}>
          <Button className={`mdl-button mdl-button--raised ${style.cancel}`} onClick={close} style={{float: 'left'}}>
            <Message>cancel</Message>
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
