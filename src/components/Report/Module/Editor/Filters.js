import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../Input'
import Select from '../../../Select'
import concat from 'lodash/concat'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import camelCase from 'lodash/camelCase'
import bind from 'lodash/bind'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import curry from 'lodash/curry'
import assign from 'lodash/assign'
import omit from 'lodash/omit'
import VerticalAlign from '../../../VerticalAlign'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import {Button} from '../../../Button'
const operators = ['contains', 'equals', 'not equals', 'less than', 'greater than', 'between']
const limitOperators = ['equals']
const fixedOperators = ['equals', 'not equals']

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

const Filter = ({id, attribute, operator, value, secondary, options, drop, change, metaData}, {messages}) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--4-col'>
      <Select name={`filters.${id}.attribute`} value={attribute} onChange={change('attribute')}>
        {map(options, ({name, id}) =>
          <option key={id} value={id}>
            {name}
          </option>)}
      </Select>
    </div>
    <div className='mdl-cell mdl-cell--3-col'>
      <Select name={`filters.${id}.operator`} value={operator} onChange={change('operator')}>
        {map(attribute === 'limit' ? limitOperators : (metaData.values ? fixedOperators : operators),
          op => <option key={op} value={op}>
            {messages[`${camelCase(op)}Operator`]}
          </option>)}
      </Select>
    </div>
    <div className='mdl-cell mdl-cell--2-col'>{metaData.values
      ? (
        <Select name={`filters.${id}.value`} value={value} onChange={change('value')}>
          <option value=''/>
          {map(metaData.values, (name, value) =>
            <option key={value} value={value}>
              {name}
            </option>)}
        </Select>
      ) : (
        <Input
          type={inputType(metaData.type)}
          name={`filters.${id}.value`}
          value={value}
          onChange={change('value')}/>)}
    </div>
    <div className='mdl-cell mdl-cell--2-col'>
      <Input
        type={inputType(metaData.type)}
        name={`filters.${id}.secondary`}
        disabled={Boolean(metaData.values) || operator !== 'between'}
        value={secondary}
        onChange={change('secondary')}/>
    </div>
    {attribute !== 'limit' && (
      <VerticalAlign className='mdl-cell mdl-cell--1-col'>
        <div>
          <Button className='mdl-button mdl-button--icon' onClick={drop}>
            <i className='material-icons'>close</i>
          </Button>
        </div>
      </VerticalAlign>)}
  </div>
)

Filter.displayName = 'Filter'
Filter.propTypes = {
  id: PropTypes.number.isRequired,
  attribute: PropTypes.string,
  operator: PropTypes.oneOf(operators).isRequired,
  value: PropTypes.any,
  secondary: PropTypes.any,
  options: PropTypes.array.isRequired,
  drop: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  metaData: PropTypes.shape({
    type: PropTypes.string
  }).isRequired
}

Filter.contextTypes = {
  messages: PropTypes.object.isRequired
}

class EditFilters extends React.Component {
  static displayName = 'Edit-Filters'

  static contextTypes = {
    messages: PropTypes.object.isRequired,
    draft: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired,
    selectable: PropTypes.object.isRequired
  }

  parseFilters = () => {
    const {draft: {module}} = this.context
    const filters = [{
      attribute: 'limit',
      operator: 'equals',
      value: module.limit,
      secondary: ''
    }]

    return concat(filters, map(omit(module.filters, 'id'),
      ([operator, value, secondary], attribute) => ({
        attribute,
        operator,
        value,
        secondary
      })))
  }

  newFilter = () => {
    const filters = concat(this.state.filters, {
      attribute: '',
      operator: 'equals',
      value: '',
      secondary: ''
    })

    this.setState({filters})
  }

  filterOutSelected = (selectedHere) => {
    const selectedElsewhere = this.state.filters

    return filter(this.context.selectable, ({id: attribute}) => (
      attribute !== 'id' && (
        attribute === selectedHere || !find(selectedElsewhere, {attribute})
      )
    ))
  }

  getOptions = (currentValue) => {
    const selectable = sortBy(this.filterOutSelected(currentValue), 'name')

    return concat([{id: '', name: ''}], selectable)
  }

  getLimitFilter = () => {
    return {
      id: 'limit',
      name: this.context.messages.resultLimitLabel,
      type: 'integer'
    }
  }

  getFilterProps = ({attribute, operator, value, secondary}) => {
    const options = attribute === 'limit'
      ? [this.getLimitFilter()]
      : this.getOptions(attribute)

    const metaData = attribute === 'limit'
      ? {type: 'integer'}
      : find(options, {id: attribute}) || {type: 'string'}

    return {
      attribute,
      operator,
      value,
      secondary,
      options,
      metaData
    }
  }

  removeFilter = (index) => {
    const filters = concat(this.state.filters)
    const filterName = filters[index].attribute

    filters.splice(index, 1)
    this.setState({filters})

    const oldFilters = this.context.draft.module.filters

    this.context.change({filters: omit(oldFilters, filterName)})
  }

  state = {
    filters: this.parseFilters()
  }

  componentWillMount () {
    const updateOnChange = (index, name, {target: {value, type}}) => {
      const oldFilters = this.context.draft.module.filters
      const filters = concat(this.state.filters)
      const oldFilterConfig = filters[index]

      if (type === 'number') {
        value = isNaN(Number(value)) ? 0 : Number(value)
      }

      const newFilterConfig = filters[index] = assign({}, oldFilterConfig, {[name]: value})

      this.setState({filters})

      if (newFilterConfig.attribute === 'limit') {
        return this.context.change({limit: value})
      }

      const parentFilters = assign({}, oldFilters)
      const switchFilters = oldFilterConfig.attribute && newFilterConfig.attribute !== oldFilterConfig.attribute

      if (switchFilters) {
        delete parentFilters[oldFilterConfig.attribute]
      }

      if (newFilterConfig.attribute) {
        parentFilters[newFilterConfig.attribute] = [newFilterConfig.operator, newFilterConfig.value, newFilterConfig.secondary]
      }

      this.context.change({filters: parentFilters})
    }

    this.onChange = curry(updateOnChange)
  }

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
        <Button className='mdl-button' onClick={this.newFilter}>
          <Message>newFilter</Message>
        </Button>
      </section>
    )
  }
}

export default EditFilters
