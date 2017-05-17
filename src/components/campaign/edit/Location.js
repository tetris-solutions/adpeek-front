import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Input from '../../Input'
import {searchLocationAction} from '../../../actions/search-location'
import debounce from 'lodash/debounce'

class Locations extends React.PureComponent {
  static displayName = 'Locations'

  static propTypes = {
    search: PropTypes.array,
    inserted: PropTypes.array
  }

  render () {
    const {search, inserted} = this.props
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--6-col'>
          <ul>
            {map(search, ({id, name, type}) =>
              <li key={id}>
                {name} <em>{type}</em>
              </li>)}
          </ul>
        </div>
        <div className='mdl-cell mdl-cell--6-col'>
          {map(inserted, ({id, name, type}) =>
            <li key={id}>
              {name} <em>{type}</em>
            </li>)}
        </div>
      </div>
    )
  }
}

class EditLocation extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    insert: PropTypes.func,
    remove: PropTypes.func,
    locations: PropTypes.array
  }

  state = {
    searchTerm: '',
    searchResult: []
  }

  onChangeSearch = ({target: {value: searchTerm}}) => {
    this.setState({searchTerm},
      searchTerm.trim().length >= 3
        ? this.search
        : this.empty)
  }

  search = debounce(() => {
    this.props.dispatch(searchLocationAction, this.state.searchTerm)
      .then(({data: searchResult}) => this.setState({searchResult}))
  }, 300)

  empty = () => {
    this.setState({searchResult: []})
  }

  render () {
    const {insert, remove, locations} = this.props
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
          inserted={locations}
          insert={insert}
          remove={remove}
          search={searchResult}/>
      </div>
    )
  }
}

export default EditLocation
