import assign from 'lodash/assign'
import concat from 'lodash/concat'
import csjs from 'csjs'
import fromPairs from 'lodash/fromPairs'
import indexOf from 'lodash/indexOf'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import toPairs from 'lodash/toPairs'
import React from 'react'
import Reorder from 'react-reorder'

import {styled} from './mixins/styled'

const style = csjs`
.list {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
.item {
  cursor: pointer;
  display: inline-block;
  width: auto;
}`

function Field ({item: {name, remove, id}}) {
  const onClick = () => remove(id, true)
  return (
    <span className='mdl-chip mdl-chip--deletable'>
      <span className='mdl-chip__text'>{name}</span>
      <button type='button' className='mdl-chip__action' onClick={onClick}>
        <i className='material-icons'>cancel</i>
      </button>
    </span>
  )
}

const {PropTypes} = React

Field.displayName = 'Field'
Field.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired
  }).isRequired
}

function mountFields (attributes, dimensions, metrics, fieldSort) {
  const extendWithAttribute = isMetric => id => ({
    id,
    isMetric,
    name: attributes[id].name
  })

  dimensions = map(dimensions, extendWithAttribute(false))
  metrics = map(metrics, extendWithAttribute(true))

  return sortBy(
    map(concat(dimensions, metrics), field => {
      const foundIndex = indexOf(fieldSort, field.id)
      return assign(field, {index: foundIndex === -1 ? Infinity : foundIndex})
    }), ['index', 'isMetric'])
}

const Fields = React.createClass({
  displayName: 'Fields',
  mixins: [styled(style)],
  propTypes: {
    module: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  },
  onReorder (event, movedItem, previousIndex, nextIndex, fieldSort) {
    const sort = fromPairs(this.props.module.sort)

    sort._fields_ = map(fieldSort, 'id')

    this.props.save({sort: toPairs(sort)})
  },
  render () {
    const {attributes, module: {dimensions, metrics, sort}} = this.props
    const sortPairs = fromPairs(sort)
    const fields = mountFields(
      attributes,
      dimensions,
      metrics,
      sortPairs._fields_
    )
    const list = map(fields, field => assign(field, {remove: this.props.remove}))
    return (
      <div className='mdl-cell mdl-cell--12-col'>
        <Reorder
          itemKey='id'
          lock='vertical'
          list={list}
          listClass={`${style.list}`}
          itemClass={`${style.item}`}
          template={Field}
          callback={this.onReorder}/>
      </div>
    )
  }
})

export default Fields
