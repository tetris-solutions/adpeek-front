import React from 'react'
import Input from './Input'
import Select from './Select'
import concat from 'lodash/concat'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import camelCase from 'lodash/camelCase'
import bind from 'lodash/bind'
import find from 'lodash/find'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import curry from 'lodash/curry'
import assign from 'lodash/assign'
import omit from 'lodash/omit'
import VerticalAlign from './VerticalAlign'

const {PropTypes} = React
const operators = ['contains', 'equals', 'less than', 'greater than', 'between']
const limitOperators = ['equals']
const notId = name => name !== 'id'
const numTypes = [
  'integer',
  'decimal',
  'percentage',
  'currency'
]

function inputType (type) {
  if (includes(numTypes, type)) {
    return 'number'
  }

  if (type === 'date') {
    return 'date'
  }

  return 'text'
}

const Filter = ({id, attribute, operator, value, secondary, attributes, drop, change, metaData}, {messages}) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--4-col'>
      <Select name={`filters.${id}.attribute`} value={attribute} onChange={change('attribute')}>
        {map(attributes, ({name, id}) =>
          <option key={id} value={id}>
            {name}
          </option>)}
      </Select>
    </div>
    <div className='mdl-cell mdl-cell--3-col'>
      <Select name={`filters.${id}.operator`} value={operator} onChange={change('operator')}>
        {map(attribute === 'limit' ? limitOperators : operators, op =>
          <option key={op} value={op}>
            {messages[`${camelCase(op)}Operator`]}
          </option>)}
      </Select>
    </div>
    <div className='mdl-cell mdl-cell--2-col'>
      <Input
        type={inputType(metaData.type)}
        name={`filters.${id}.value`}
        value={value}
        onChange={change('value')}/>
    </div>
    <div className='mdl-cell mdl-cell--2-col'>
      <Input
        type={inputType(metaData.type)}
        name={`filters.${id}.secondary`}
        disabled={operator !== 'between'}
        value={secondary}
        onChange={change('secondary')}/>
    </div>
    <VerticalAlign className='mdl-cell mdl-cell--1-col'>
      <div>
        <button type='button' className='mdl-button mdl-js-button mdl-button--icon' onClick={drop}>
          <i className='material-icons'>close</i>
        </button>
      </div>
    </VerticalAlign>
  </div>
)

Filter.displayName = 'Filter'
Filter.propTypes = {
  id: PropTypes.number.isRequired,
  attribute: PropTypes.string,
  operator: PropTypes.oneOf(operators).isRequired,
  value: PropTypes.any,
  secondary: PropTypes.any,
  attributes: PropTypes.array.isRequired,
  drop: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  metaData: PropTypes.shape({
    type: PropTypes.string
  }).isRequired
}

Filter.contextTypes = {
  messages: PropTypes.object.isRequired
}

const ReportModuleEditFilters = React.createClass({
  displayName: 'Edit-Filters',
  getInitialState () {
    return {
      filters: this.parseFilters()
    }
  },
  propTypes: {
    limit: PropTypes.number,
    filters: PropTypes.object.isRequired,
    dimensions: PropTypes.array.isRequired,
    metrics: PropTypes.array.isRequired,
    attributes: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  },
  contextTypes: {
    messages: PropTypes.object.isRequired
  },
  parseFilters () {
    const filters = [{
      attribute: 'limit',
      operator: 'equals',
      value: this.props.limit,
      secondary: ''
    }]

    return concat(filters, map(omit(this.props.filters, 'id'),
      ([operator, value, secondary], attribute) => ({
        attribute,
        operator,
        value,
        secondary
      })))
  },
  newFilter () {
    const filters = concat(this.state.filters, {
      attribute: '',
      operator: 'equals',
      value: '',
      secondary: ''
    })

    this.setState({filters})
  },
  filterOutSelected (ls, current) {
    const taken = map(this.state.filters, 'attribute')
    const notTaken = id => id === current || !includes(taken, id)

    return filter(ls, notTaken)
  },
  getAttributes (current) {
    const {metrics, dimensions, attributes} = this.props
    const metricsAndDimensions = concat(filter(dimensions, notId), metrics)
    const ls = this.filterOutSelected(metricsAndDimensions, current)

    return concat([{id: '', name: ''}], compact(map(ls, id => find(attributes, {id}))))
  },
  getFilterProps ({attribute, operator, value, secondary}) {
    const attributes = attribute === 'limit'
      ? [{id: 'limit', name: this.context.messages.resultLimitLabel, type: 'integer'}]
      : this.getAttributes(attribute)
    const metaData = attribute === 'limit'
      ? {type: 'integer'}
      : find(attributes, 'id', attribute) || {type: 'string'}

    return {
      attribute,
      operator,
      value,
      secondary,
      attributes,
      metaData
    }
  },
  removeFilter (index) {
    const filters = concat(this.state.filters)

    filters.splice(index, 1)

    this.setState({filters})
  },
  componentWillMount () {
    this.onChange = curry((index, name, {target: {value, type}}) => {
      const filters = concat(this.state.filters)
      const oldFilterConfig = filters[index]

      if (type === 'number') {
        value = isNaN(Number(value)) ? 0 : Number(value)
      }

      const newFilterConfig = filters[index] = assign({}, oldFilterConfig, {[name]: value})

      this.setState({filters})

      if (newFilterConfig.attribute === 'limit') {
        return this.props.update({limit: value})
      }

      const parentFilters = assign({}, this.props.filters)
      const switchFilters = oldFilterConfig.attribute && newFilterConfig.attribute !== oldFilterConfig.attribute

      if (switchFilters) {
        delete parentFilters[oldFilterConfig.attribute]
      }

      if (newFilterConfig.attribute) {
        parentFilters[newFilterConfig.attribute] = [newFilterConfig.operator, newFilterConfig.value, newFilterConfig.secondary]
      }

      this.props.update({filters: parentFilters})
    })
  },
  render () {
    return (
      <section style={{height: '80vh', overflowY: 'auto'}}>
        <div className='mdl-grid'>
          {map(this.state.filters, (filter, index) =>
            <Filter
              key={index}
              change={this.onChange(index)}
              id={index} {...this.getFilterProps(filter)}
              drop={bind(this.removeFilter, null, index)}/>)}
        </div>
        <button className='mdl-button' type='button' onClick={this.newFilter}>
          <Message>newFilter</Message>
        </button>
      </section>
    )
  }
})

export default ReportModuleEditFilters
