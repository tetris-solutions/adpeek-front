import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Tab, Tabs} from '../../Tabs'
import noop from 'lodash/noop'
import Location from './Location'
import filter from 'lodash/filter'
import map from 'lodash/map'
import concat from 'lodash/concat'
import {Submit, Button} from '../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import {updateCampaignLocationAction} from '../../../actions/update-campaign-location'

const style = csjs`
.actions {
  margin-top: 1em;
}
.submit {
  float: right
}`

const normalizeLocation = ({id, location: name, location_type: type}) => ({id, name, type})
const isLocation = {type: 'LOCATION'}

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

  onSubmit = e => {
    e.preventDefault()

    const {dispatch, params, onSubmit} = this.props

    dispatch(updateCampaignLocationAction, params, this.state.locations)
      .then(onSubmit)
  }

  render () {
    const {messages} = this.context
    const {dispatch, onSubmit: close} = this.props

    return (
      <form onSubmit={this.onSubmit}>
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
        <div className={`${style.actions}`}>
          <Button className='mdl-button mdl-button--raised' onClick={close}>
            <Message>cancel</Message>
          </Button>
          <Submit className={`mdl-button mdl-button--raised mdl-button--colored ${style.submit}`}>
            <Message>save</Message>
          </Submit>
        </div>
      </form>
    )
  }
}

export default styledComponent(EditGeoLocation, style)
