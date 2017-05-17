import React from 'react'
import PropTypes from 'prop-types'
import {Tab, Tabs} from '../../Tabs'
import noop from 'lodash/noop'
import Location from './Location'
import filter from 'lodash/filter'
import map from 'lodash/map'
import concat from 'lodash/concat'

const normalizeLocation = ({id, location: name, location_type: type}) => ({id, name, type})
const isLocation = {type: 'LOCATION'}

class EditGeoLocation extends React.Component {
  static displayName = 'Edit-Geo-Location'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object
  }

  static defaultProps = {
    onSubmit: noop
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    locations: map(filter(this.props.campaign.details.criteria, isLocation), normalizeLocation)
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

  render () {
    const {messages} = this.context
    const {dispatch} = this.props

    return (
      <Tabs>
        <Tab id='location-criteria' title={messages.locationCriteria}>
          <Location
            dispatch={dispatch}
            add={this.addLocation}
            remove={this.removeLocation}
            locations={this.state.locations}/>
        </Tab>
        <Tab id='proximity-criteria' title={messages.proximityCriteria}>
          <p>nooo</p>
        </Tab>
      </Tabs>
    )
  }
}

export default EditGeoLocation
