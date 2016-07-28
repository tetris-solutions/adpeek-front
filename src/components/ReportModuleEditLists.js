import React from 'react'
import Attributes from './ReportModuleEditAttributes'
import reportEntityType from '../propTypes/report-entity'
import includes from 'lodash/includes'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import lowerCase from 'lodash/lowerCase'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import trim from 'lodash/trim'

const {PropTypes} = React
const clean = str => trim(lowerCase(deburr(str)))

const matching = (ls, searchValue) => searchValue
  ? filter(ls, ({name}) => includes(clean(name), searchValue))
  : ls

const sorted = ls => sortBy(ls, 'name')

const Lists = React.createClass({
  displayName: 'Lists',
  propTypes: {
    attributes: PropTypes.object.isRequired,
    metrics: PropTypes.array.isRequired,
    dimensions: PropTypes.array.isRequired,
    entity: reportEntityType.isRequired,
    removeEntity: PropTypes.func.isRequired,
    addEntity: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      id: PropTypes.array
    }).isRequired
  },
  getInitialState () {
    return {
      searchValue: ''
    }
  },
  componentWillMount () {
    this.onChangeSearch = debounce(this.onChangeSearch, 300)
    this.updateLists()
  },
  componentWillReceiveProps (nextProps) {
    if (nextProps.attributes !== this.props.attributes || nextProps.entity !== this.props.entity) {
      this.updateLists(nextProps)
    }
  },
  updateLists (props = this.props, searchValue = this.state.searchValue) {
    const attributes = sorted(matching(props.attributes, searchValue))
    const list = sorted(matching(props.entity.list, searchValue))
    const dimensions = filter(attributes, 'is_dimension')
    const metrics = filter(attributes, 'is_metric')

    this.setState({list, dimensions, metrics, searchValue})
  },
  onChangeSearch () {
    const input = this.refs.wrapper.querySelector('input')
    this.updateLists(this.props, clean(input.value))
  },
  render () {
    const selectedMetrics = this.props.metrics
    const selectedDimensions = this.props.dimensions
    const selectedIds = this.props.filters.id
    const {entity, removeEntity, addEntity, addItem, removeItem} = this.props
    const {dimensions, metrics, list} = this.state

    return (
      <div ref='wrapper'>
        <Input name='searchValue' onChange={this.onChangeSearch}/>

        <Attributes
          title={entity.name}
          attributes={list}
          selectedAttributes={selectedIds}
          removeItem={removeEntity}
          addItem={addEntity}/>

        <Attributes
          title={<Message>metrics</Message>}
          attributes={metrics}
          selectedAttributes={selectedMetrics}
          removeItem={selectedMetrics.length > 1 ? removeItem : undefined}
          addItem={addItem}/>

        <Attributes
          title={<Message>dimensions</Message>}
          attributes={dimensions}
          selectedAttributes={selectedDimensions}
          removeItem={selectedDimensions.length > 1 ? removeItem : undefined}
          addItem={addItem}/>
      </div>
    )
  }
})

export default Lists
