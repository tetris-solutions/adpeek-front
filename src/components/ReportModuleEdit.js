import React from 'react'
import pick from 'lodash/pick'
import Select from './Select'
import map from 'lodash/map'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import assign from 'lodash/assign'
import Message from '@tetris/front-server/lib/components/intl/Message'

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
.selected {
  border-left: 3px solid #79cbf3;
  font-weight: bold
}`

const {PropTypes} = React

const Li = ({id, name, selected, toggle}) => {
  const onClick = () => toggle(id)

  return (
    <li onClick={onClick} className={`${style.item} ${selected ? style.selected : ''}`}>
      {name}
    </li>
  )
}

Li.displayName = 'Item'
Li.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  selected: PropTypes.bool,
  toggle: PropTypes.func
}

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  mixins: [styled(style)],
  propTypes: {
    cancel: PropTypes.func,
    id: PropTypes.string,
    type: PropTypes.oneOf([
      'line',
      'column',
      'pie',
      'table'
    ]),
    entity: PropTypes.object,
    dimensions: PropTypes.array,
    filter: PropTypes.shape({
      id: PropTypes.array
    })
  },
  getInitialState () {
    return pick(this.props, 'type', 'dimensions', 'filter')
  },
  onChangeType ({target: {value}}) {
    this.setState({type: value})
  },
  handleSubmit (e) {
    e.preventDefault()
  },
  toggleEntityFilter (id) {
    const idFilter = this.state.filter.id

    if (idFilter[id]) {
      delete idFilter[id]
    } else {
      idFilter[id] = true
    }

    this.setState({
      filter: assign({}, this.state.filter, {id: idFilter})
    })
  },
  render () {
    const {entity} = this.props
    const {type, filter} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--4-col'>

            <h5 className={`${style.listTitle}`}>{entity.name}</h5>
            <ul className={`${style.list}`}>
              {map(entity.list, item =>
                <Li
                  {...item}
                  toggle={this.toggleEntityFilter}
                  selected={Boolean(filter.id[item.id])}
                  key={item.id}/>)}
            </ul>

          </div>
          <div className='mdl-cell mdl-cell--8-col'>
            <Select label='moduleType' name='type' onChange={this.onChangeType}>
              <option value=''>-- select --</option>
              <option value='column'>
                <Message>columnChart</Message>
              </option>
              <option value='line'>
                <Message>lineChart</Message>
              </option>
              <option value='pie'>
                <Message>pieChart</Message>
              </option>
              <option value='table'>
                <Message>table</Message>
              </option>
            </Select>
            <hr/>
            <img src='/contrived-graph.png'/>
          </div>
        </div>

        <a className='mdl-button' onClick={this.props.cancel}>
          cancel
        </a>
        <button className='mdl-button' disabled={type === null}>
          save
        </button>
      </form>
    )
  }
})

export default ModuleEdit
