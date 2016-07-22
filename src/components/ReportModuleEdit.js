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

const Li = ({id, name, selected, add, remove, fixed}) => {
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

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  mixins: [styled(style)],
  contextTypes: {
    messages: PropTypes.object
  },
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
  removeItem (name) {
    return id => this.setState({
      [name]: this.state[name].filter(i => i !== id)
    })
  },
  addItem (name) {
    return id => this.setState({
      [name]: this.state[name].concat([id])
    })
  },
  render () {
    const {messages} = this.context
    const {metaData, entity, id, reportParams} = this.props
    const {type, filters, metrics, dimensions} = this.state
    const canCancel = !isEmpty(this.props.metrics)
    const canSave = !isEmpty(metrics)

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--4-col'>
            <h5 className={`${style.listTitle}`}>{entity.name}</h5>
            <ul className={`${style.list}`}>
              {map(entity.list, item => {
                const isSelected = includes(filters.id, item.id)

                return (
                  <Li
                    {...item}
                    add={this.addEntity}
                    fixed={isSelected && filters.id.length === 1}
                    remove={this.removeEntity}
                    selected={isSelected}
                    key={item.id}/>
                )
              })}
            </ul>

            <h5 className={`${style.listTitle}`}>Metrics</h5>
            <ul className={`${style.list}`}>
              {map(metaData.metrics, item => {
                const isSelected = includes(metrics, item)

                return (
                  <Li
                    id={item}
                    name={item}
                    fixed={isSelected && metrics.length === 1}
                    add={this.addItem('metrics')}
                    remove={this.removeItem('metrics')}
                    selected={isSelected}
                    key={item}/>
                )
              })}
            </ul>

            <h5 className={`${style.listTitle}`}>Dimensions</h5>
            <ul className={`${style.list}`}>
              {map(metaData.dimensions, item => {
                const fixed = item === 'id' && entity.id === 'Campaign'
                return (
                  <Li
                    id={item}
                    name={item}
                    fixed={fixed}
                    add={this.addItem('dimensions')}
                    remove={this.removeItem('dimensions')}
                    selected={includes(dimensions, item)}
                    key={item}/>
                )
              })}
            </ul>
          </div>

          <div className='mdl-cell mdl-cell--8-col'>
            <Select
              label='moduleType'
              name='type'
              onChange={this.onChangeType}
              value={type || ''}>
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
