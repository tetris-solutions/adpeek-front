import React from 'react'
import {branch} from 'baobab-react/higher-order'
import pick from 'lodash/pick'
import Select from './Select'
import Input from './Input'
import map from 'lodash/map'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import assign from 'lodash/assign'
import Message from '@tetris/front-server/lib/components/intl/Message'
import includes from 'lodash/includes'
import reportParamsType from '../propTypes/report-params'
import reportModuleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import ReportChart from './ReportChart'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import find from 'lodash/find'

const style = csjs`
.listTitle {
  margin: .5em .3em .8em 0;
  color: rgba(0, 0, 0, 0.4)
}
.list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.item {
  text-indent: 1em;
  border-left: 3px solid #e4e4e4;
  cursor: pointer;
  line-height: 1.8em;
  user-select: none
}
.fixed {
  color: #232363
}
.selected {
  border-left: 3px solid #79cbf3;
  font-weight: bold
}`

const {PropTypes} = React

function Li ({id, name, selected, add, remove, fixed}) {
  const onClick = selected
    ? () => remove(id)
    : () => add(id)

  const className = `${style.item} ${selected ? style.selected : ''} ${fixed ? style.fixed : ''}`

  return (
    <li onClick={fixed ? undefined : onClick} className={className}>
      {name}
    </li>
  )
}

Li.displayName = 'Item'
Li.defaultProps = {
  fixed: false
}
Li.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  selected: PropTypes.bool,
  fixed: PropTypes.bool,
  add: PropTypes.func,
  remove: PropTypes.func
}

const editableFields = ['name', 'type', 'dimensions', 'filters', 'metrics']

function TypeSelect ({onChange, value}, {messages}) {
  return (
    <Select label='moduleType' name='type' onChange={onChange} value={value}>
      <option value='column'>
        {messages.columnChart}
      </option>
      <option value='line'>
        {messages.lineChart}
      </option>
      <option value='pie'>
        {messages.pieChart}
      </option>
      <option value='table'>
        {messages.table}
      </option>
    </Select>
  )
}

TypeSelect.displayName = 'Type-Select'
TypeSelect.contextTypes = {
  messages: PropTypes.object
}
TypeSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
}

function AttributesToggle ({attributes, selectedAttributes, addItem, removeItem}) {
  const lastSelected = selectedAttributes.length === 1
  const add = id => () => addItem(id)
  const remove = id => () => removeItem(id)

  return (
    <ul className={`${style.list}`}>
      {map(attributes, ({id, name}) => {
        const isSelected = includes(selectedAttributes, id)

        return (
          <Li
            id={id}
            name={name}
            fixed={isSelected && lastSelected}
            add={add(id)}
            remove={remove(id)}
            selected={isSelected}
            key={id}/>
        )
      })}
    </ul>
  )
}

AttributesToggle.displayName = 'Attributes-Toggle'
AttributesToggle.propTypes = {
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  attributes: PropTypes.array.isRequired,
  selectedAttributes: PropTypes.array.isRequired
}

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  mixins: [styled(style)],
  propTypes: {
    reportParams: reportParamsType,
    module: reportModuleType,
    entity: reportEntityType,
    metaData: reportMetaDataType,
    cancel: PropTypes.func,
    save: PropTypes.func
  },
  getInitialState () {
    const state = pick(this.props.module, editableFields)

    if (isEmpty(state.dimensions) && this.props.entity.id === 'Campaign') {
      state.dimensions = ['id']
    }

    return state
  },
  getDefaultProps () {
    return {
      metaData: {
        metrics: [],
        dimensions: [],
        filters: []
      }
    }
  },
  onChangeInput ({target: {name, value}}) {
    this.setState({[name]: value})
  },
  handleSubmit (e) {
    e.preventDefault()
    this.props.save(pick(this.state, editableFields))
  },
  removeEntity (id) {
    this.setState({
      filters: assign({}, this.state.filters, {
        id: this.state.filters.id.filter(m => m !== id)
      })
    })
  },
  addEntity (id) {
    this.setState({
      filters: assign({}, this.state.filters, {
        id: this.state.filters.id.concat([id])
      })
    })
  },
  removeItem (id) {
    const attribute = find(this.props.metaData.attributes, {id})
    if (attribute.is_dimension) {
      this.setState({dimensions: this.state.dimensions.filter(i => i !== id)})
    }

    if (attribute.is_metric) {
      this.setState({metrics: this.state.metrics.filter(i => i !== id)})
    }
  },
  addItem (id) {
    const attribute = find(this.props.metaData.attributes, {id})
    if (attribute.is_dimension) {
      this.setState({dimensions: this.state.dimensions.concat([id])})
    }

    if (attribute.is_metric) {
      this.setState({metrics: this.state.metrics.concat([id])})
    }
  },
  render () {
    const {metaData, entity, module, reportParams} = this.props
    const {name, type, filters, metrics, dimensions} = this.state
    const canCancel = !isEmpty(module.metrics)
    const canSave = !isEmpty(metrics)
    const updatedModule = assign({}, module, pick(this.state, editableFields))

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--4-col'>
            <h5 className={`${style.listTitle}`}>{entity.name}</h5>
            <ul className={`${style.list}`}>
              {map(entity.list, item => (
                <Li
                  {...item}
                  add={this.addEntity}
                  remove={this.removeEntity}
                  selected={includes(filters.id, item.id)}
                  key={item.id}/>
              ))}
            </ul>

            <h5 className={`${style.listTitle}`}>
              <Message>metrics</Message>
            </h5>

            <AttributesToggle
              attributes={filter(metaData.attributes, 'is_metric')}
              selectedAttributes={metrics}
              removeItem={this.removeItem}
              addItem={this.addItem}/>

            <h5 className={`${style.listTitle}`}>
              <Message>dimensions</Message>
            </h5>

            <AttributesToggle
              attributes={filter(metaData.attributes, 'is_dimension')}
              selectedAttributes={dimensions}
              removeItem={this.removeItem}
              addItem={this.addItem}/>
          </div>

          <div className='mdl-cell mdl-cell--8-col'>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--7-col'>
                <Input
                  name='name'
                  value={name}
                  onChange={this.onChangeInput}/>
              </div>
              <div className='mdl-cell mdl-cell--5-col'>
                <TypeSelect onChange={this.onChangeInput} value={type}/>
              </div>
            </div>

            <ReportChart
              module={updatedModule}
              entity={entity}
              reportParams={reportParams}/>
          </div>
        </div>

        <a className='mdl-button' disabled={!canCancel} onClick={canCancel ? this.props.cancel : undefined}>
          <Message>cancel</Message>
        </a>

        <button className='mdl-button' disabled={!canSave}>
          <Message>save</Message>
        </button>
      </form>
    )
  }
})

export default branch(({entity, reportParams}) => ({
  metaData: ['reports', 'metaData', reportParams.platform, entity.id]
}), ModuleEdit)
