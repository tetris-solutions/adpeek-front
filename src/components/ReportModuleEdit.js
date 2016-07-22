import React from 'react'
import {branch} from 'baobab-react/higher-order'
import pick from 'lodash/pick'
import Select from './Select'
import map from 'lodash/map'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import assign from 'lodash/assign'
import Message from '@tetris/front-server/lib/components/intl/Message'
import includes from 'lodash/includes'
import reportType from '../propTypes/report'
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

const editableFields = ['type', 'dimensions', 'filters', 'metrics']

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

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  mixins: [styled(style)],
  propTypes: assign({
    metaData: PropTypes.shape({
      metrics: PropTypes.array,
      dimensions: PropTypes.array,
      filters: PropTypes.array
    }),
    cancel: PropTypes.func,
    save: PropTypes.func
  }, reportType),
  getInitialState () {
    const state = pick(this.props, editableFields)

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
  onChangeType ({target: {value}}) {
    this.setState({type: value})
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
    const {metaData, entity, id, reportParams} = this.props
    const {type, filters, metrics, dimensions} = this.state
    const canCancel = !isEmpty(this.props.metrics)
    const canSave = !isEmpty(metrics)
    const attributes = filter(metaData.attributes, ({is_dimension, is_metric}) => is_dimension || is_metric)
    const lastSelectedMetric = metrics.length === 1

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
              <Message>reportAttributes</Message>
            </h5>

            <ul className={`${style.list}`}>
              {map(attributes, ({id, name, is_metric}) => {
                const isSelected = includes(metrics, id) || includes(dimensions, id)
                const add = () => this.addItem(id)
                const remove = () => this.removeItem(id)

                return (
                  <Li
                    id={id}
                    name={name}
                    fixed={id === 'id' || (isSelected && is_metric && lastSelectedMetric)}
                    add={add}
                    remove={remove}
                    selected={isSelected}
                    key={id}/>
                )
              })}
            </ul>
          </div>

          <div className='mdl-cell mdl-cell--8-col'>
            <TypeSelect onChange={this.onChangeType} value={type || ''}/>

            <ReportChart
              dimensions={dimensions}
              metrics={metrics}
              id={id}
              type={type}
              entity={entity}
              filters={filters}
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
