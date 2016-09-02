import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import sortBy from 'lodash/sortBy'
import trim from 'lodash/trim'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import reportEntityType from '../propTypes/report-entity'
import Attributes from './ReportModuleEditAttributes'
import EntityList from './ReportModuleEditEntityList'
import Input from './Input'
import {Tabs, Tab} from './Tabs'

const {PropTypes} = React
const clean = str => trim(lowerCase(deburr(str)))

const containsSearchvalue = searchValue =>
  ({name, headline, description}) => (
    includes(clean(name), searchValue) ||
    includes(clean(description), searchValue) ||
    includes(clean(headline), searchValue)
  )

const matching = (ls, searchValue) => searchValue
  ? filter(ls, containsSearchvalue(searchValue))
  : ls

const sorted = ls => sortBy(ls, 'name')

const Lists = React.createClass({
  displayName: 'Lists',
  propTypes: {
    entities: PropTypes.array,
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
      searchValue: '',
      activeTab: 'entity'
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
    const input = this.refs.wrapper.querySelector('input[name="searchValue"]')
    this.updateLists(this.props, clean(input.value))
  },
  onChangeTab (activeTab) {
    this.setState({activeTab})
  },
  render () {
    const selectedMetrics = this.props.metrics
    const selectedDimensions = this.props.dimensions
    const selectedIds = this.props.filters.id
    const {entity, removeEntity, addEntity, addItem, removeItem} = this.props
    const {dimensions, metrics, list, activeTab} = this.state
    const isIdSelected = includes(selectedDimensions, 'id')

    return (
      <div ref='wrapper'>
        <Input
          label='filter'
          name='searchValue'
          onChange={this.onChangeSearch}/>

        <Tabs onChangeTab={this.onChangeTab}>
          <Tab id='entity' title={entity.name} active={activeTab === 'entity'}>
            <EntityList
              entity={entity}
              entities={this.props.entities}
              title={entity.name}
              attributes={list}
              isIdSelected={isIdSelected}
              selectedAttributes={selectedIds}
              removeItem={removeEntity}
              addItem={addEntity}/>
          </Tab>
          <Tab id='metric' title={<Message>metrics</Message>} active={activeTab === 'metric'}>
            <Attributes
              title={<Message>metrics</Message>}
              attributes={metrics}
              isIdSelected={isIdSelected}
              selectedAttributes={selectedMetrics}
              removeItem={removeItem}
              addItem={addItem}/>
          </Tab>
          <Tab id='dimension' title={<Message>dimensions</Message>} active={activeTab === 'dimension'}>
            <Attributes
              title={<Message>dimensions</Message>}
              attributes={dimensions}
              isIdSelected={isIdSelected}
              selectedAttributes={selectedDimensions}
              removeItem={removeItem}
              addItem={addItem}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
})

export default Lists
