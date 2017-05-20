import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import Input from '../../Input'
import {searchLocationAction} from '../../../actions/search-location'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import keyBy from 'lodash/keyBy'
import filter from 'lodash/filter'
import PrettyNumber from '../../PrettyNumber'
import {stringifyAddressComponents} from '../../../functions/stringify-address'

const style = csjs`
.list {
  height: 400px;
  overflow-y: auto;
}`

const MIN_SEARCH_TERM_LENGTH = 2
const unitAbbr = {
  KILOMETERS: 'km',
  MILES: 'mi'
}

class Location extends React.PureComponent {
  static displayName = 'Location'

  static propTypes = {
    location: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      type: PropTypes.string,
      radius: PropTypes.number,
      unit: PropTypes.string,
      address: PropTypes
    }).isRequired,
    toggle: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired
  }

  onClick = e => {
    e.preventDefault()

    this.props.toggle(this.props.location)
  }

  render () {
    const {location, icon} = this.props

    const name = location.name ||
      (
        <span>
          <PrettyNumber>{location.radius}</PrettyNumber> {unitAbbr[location.unit]}

          <Message location={location.address
            ? stringifyAddressComponents(location.address)
            : `{${location.lat}°, ${location.lng}°}`}>closeToLocation</Message>
        </span>
      )

    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          {name}
        </span>
        <a href='' className='mdl-list__item-secondary-action' onClick={this.onClick}>
          <i className='material-icons'>{icon}</i>
        </a>
      </li>
    )
  }
}

const LocationGroup = ({list, type, toggle, icon}) => (
  <div>
    <h6 className='mdl-color-text--grey-700'>
      <em>{type}</em>
    </h6>
    <ul className='mdl-list'>{map(list, location =>
      <Location
        key={location.id}
        location={location}
        toggle={toggle}
        icon={icon}/>)}
    </ul>
  </div>
)

LocationGroup.displayName = 'Location-Group'
LocationGroup.propTypes = {
  list: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired
}

function Locations ({add, remove, search, selected}) {
  selected = keyBy(selected, 'id')

  const notSelected = ({id}) => !selected[id]

  return (
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--6-col'>
        <h5>
          <Message>locationSearchResult</Message>
        </h5>
        <div className={`${style.list}`}>{map(groupBy(filter(search, notSelected), 'location_type'), (list, type) =>
          <LocationGroup key={type} list={list} type={type} toggle={add} icon='add'/>)}
        </div>
      </div>
      <div className={`mdl-cell mdl-cell--6-col`}>
        <h5>
          <Message>campaignLocations</Message>
        </h5>
        <div className={`${style.list}`}>{map(groupBy(selected, 'location_type'), (list, type) =>
          <LocationGroup key={type} list={list} type={type} toggle={remove} icon='remove'/>)}
        </div>
      </div>
    </div>
  )
}

Locations.displayName = 'Locations'
Locations.propTypes = {
  search: PropTypes.array,
  selected: PropTypes.array,
  add: PropTypes.func,
  remove: PropTypes.func
}

class EditLocation extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    add: PropTypes.func,
    remove: PropTypes.func,
    locations: PropTypes.array
  }

  state = {
    searchTerm: '',
    searchResult: []
  }

  onChangeSearch = ({target: {value: searchTerm}}) => {
    this.setState({searchTerm},
      searchTerm.trim().length >= MIN_SEARCH_TERM_LENGTH
        ? this.search
        : this.empty)
  }

  search = debounce(() => {
    this.props.dispatch(searchLocationAction, deburr(this.state.searchTerm))
      .then(({data: searchResult}) =>
        this.setState({searchResult}))
  }, 300)

  empty = () => {
    this.setState({searchResult: []})
  }

  render () {
    const {add, remove, locations} = this.props
    const {searchTerm, searchResult} = this.state

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              type='search'
              name='searchTerm'
              label='location'
              onChange={this.onChangeSearch}
              value={searchTerm}/>
          </div>
        </div>

        <Locations
          selected={locations}
          add={add}
          remove={remove}
          search={searchResult}/>
      </div>
    )
  }
}

export default styledComponent(EditLocation, style)
