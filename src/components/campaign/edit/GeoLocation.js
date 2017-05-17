import React from 'react'
import PropTypes from 'prop-types'
import {Tab, Tabs} from '../../Tabs'
import noop from 'lodash/noop'
import Location from './Location'
import filter from 'lodash/filter'
import map from 'lodash/map'

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

  render () {
    const {messages} = this.context
    const {dispatch, campaign: {details: {criteria}}} = this.props

    return (
      <Tabs>
        <Tab id='location-criteria' title={messages.locationCriteria}>
          <Location
            dispatch={dispatch}
            locations={map(filter(criteria, isLocation), normalizeLocation)}/>
        </Tab>
        <Tab id='proximity-criteria' title={messages.proximityCriteria}>
          <p>nooo</p>
        </Tab>
      </Tabs>
    )
  }
}

export default EditGeoLocation
