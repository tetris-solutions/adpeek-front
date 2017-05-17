import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Input from '../../Input'
import {searchLocationAction} from '../../../actions/search-location'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'

const MIN_SEARCH_TERM_LENGTH = 2

class Location extends React.PureComponent {
  static displayName = 'Location'

  static propTypes = {
    location: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string
    }).isRequired,
    toggle: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired
  }

  onClick = e => {
    e.preventDefault()

    this.props.toggle(this.props.location)
  }

  render () {
    const {location: {name, type}, icon} = this.props

    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          {name} (<small>{type}</small>)
        </span>
        <a href='' className='mdl-list__item-secondary-action' onClick={this.onClick}>
          <i className='material-icons'>{icon}</i>
        </a>
      </li>
    )
  }
}

class Locations extends React.PureComponent {
  static displayName = 'Locations'

  static propTypes = {
    search: PropTypes.array,
    selected: PropTypes.array,
    add: PropTypes.func,
    remove: PropTypes.func
  }

  render () {
    const {add, remove, search, selected} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--6-col'>
          <ul className='mdl-list'>
            {map(search, location =>
              <Location
                key={location.id}
                location={location}
                toggle={add}
                icon='add'/>)}
          </ul>
        </div>
        <div className='mdl-cell mdl-cell--6-col'>
          <ul className='mdl-list'>
            {map(selected, location =>
              <Location
                key={location.id}
                location={location}
                toggle={remove}
                icon='remove'/>)}
          </ul>
        </div>
      </div>
    )
  }
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
              name='searchTerm'
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

export default EditLocation
