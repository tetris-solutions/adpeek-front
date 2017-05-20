import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import CriteriaRow from './CriteriaRow'
import noop from 'lodash/noop'
import groupBy from 'lodash/groupBy'
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
import isNumber from 'lodash/isNumber'
import CreateGeoCriteria from './CreateGeoCriteria'

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
  min-height: 40vh;
}
.tableWrapper > table {
  width: 100%;
}`

const preparePoint = point => assign({}, point, {
  id: point.draft ? null : point.id,
  lat: floor(point.lat * Math.pow(10, 6)),
  lng: floor(point.lng * Math.pow(10, 6))
})

const normalizeCriteria = criteria => assign({}, criteria, {
  bid_modifier: isNumber(criteria.bid_modifier)
    ? (criteria.bid_modifier / 100) + 1
    : null
})

const parseLocation = ({id, location: name, location_type, type, bid_modifier}) => ({
  id,
  name,
  location_type,
  type,
  bid_modifier: isNumber(bid_modifier)
    ? 100 * (bid_modifier - 1)
    : undefined
})

const parseProximity = ({id, geo_point, radius, radius_unit: unit, address, bid_modifier, type}) => ({
  id,
  lat: geo_point.latitudeInMicroDegrees / Math.pow(10, 6),
  lng: geo_point.longitudeInMicroDegrees / Math.pow(10, 6),
  radius,
  type,
  location_type: 'Proximity',
  unit,
  address,
  bid_modifier: isNumber(bid_modifier)
    ? 100 * (bid_modifier - 1)
    : undefined
})

const isLocation = ({type}) => type === 'LOCATION' || type === 'PROXIMITY'

const parse = criteria => criteria.type === 'LOCATION'
  ? parseLocation(criteria)
  : parseProximity(criteria)

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
    criteria: map(filter(this.props.campaign.details.criteria, isLocation), parse)
  }

  componentWillMount () {
    if (isEmpty(this.state.criteria)) {
      this.setState({createModalOpen: true})
    }
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props
    const criteria = groupBy(map(this.state.criteria, normalizeCriteria), 'type')

    return Promise.all([
      dispatch(updateCampaignLocationAction, params, criteria.LOCATION || []),
      dispatch(updateCampaignProximityAction, params, map(criteria.PROXIMITY, preparePoint))
    ]).then(onSubmit)
  }

  addCriteria = criteria => {
    this.setState({
      createModalOpen: false,
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
    const {criteria, createModalOpen} = this.state

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

        {createModalOpen && (
          <CreateGeoCriteria
            dispatch={this.props.dispatch}
            save={this.addCriteria}
            cancel={this.toggleCreationModal}/>)}
      </Form>
    )
  }
}

export default styledComponent(EditGeoLocation, style)
