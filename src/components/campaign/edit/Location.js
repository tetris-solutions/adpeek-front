import React from 'react'
import PropTypes from 'prop-types'
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

const style = csjs`
.list {
  max-height: 400px;
  overflow-y: auto;
}
.list li {
  cursor: pointer;
  transition: background-color .5s ease;
}
.list li:hover {
  background-color: rgba(0, 0, 0, 0.2)
}`

const MIN_SEARCH_TERM_LENGTH = 2

class EditLocation extends React.Component {
  static propTypes = {
    selectedIds: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
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

  select = location => {
    this.props.select(location)
  }

  render () {
    const {selectedIds, select} = this.props
    const {searchTerm, searchResult} = this.state
    const selected = keyBy(selectedIds)
    const notSelected = ({id}) => !selected[id]

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <Input
            type='search'
            name='searchTerm'
            label='location'
            onChange={this.onChangeSearch}
            value={searchTerm}/>
        </div>

        <div className={`mdl-cell mdl-cell--12-col ${style.list}`}>
          {map(groupBy(filter(searchResult, notSelected), 'type'), (list, type) =>
            <div key={type}>
              <h6 className='mdl-color-text--grey-700'>
                <em>{type}</em>
              </h6>
              <ul className='mdl-list'>{map(list, location =>
                <li key={location.id} className='mdl-list__item' onClick={() => select(location)}>
                  <span className='mdl-list__item-primary-content'>
                    {location.name}
                  </span>
                </li>)}
              </ul>
            </div>)}
        </div>
      </div>
    )
  }
}

export default styledComponent(EditLocation, style)
