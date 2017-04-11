import assign from 'lodash/assign'
import concat from 'lodash/concat'
import csjs from 'csjs'
import fromPairs from 'lodash/fromPairs'
import indexOf from 'lodash/indexOf'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import toPairs from 'lodash/toPairs'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import Reorder from 'react-reorder'
import {Button} from '../../../Button'
import {styled} from '../../../mixins/styled'

const style = csjs`
.list {
  user-select: none;
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
      <Button className='mdl-chip__action' onClick={onClick}>
        <i className='material-icons'>cancel</i>
      </Button>
    </span>
  )
}

Field.displayName = 'Field'
Field.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired
  }).isRequired
}

function mountFields (attributes, dimensions, metrics, fieldSort) {
  function normalizeField (field) {
    const foundIndex = indexOf(fieldSort, field)
    return {
      id: field,
      name: attributes[field].name,
      index: foundIndex >= 0 ? foundIndex : Infinity
    }
  }

  return sortBy(map(concat(dimensions, metrics), normalizeField), 'index')
}

const SelectedFields = createReactClass({
  displayName: 'Selected-Fields',
  mixins: [styled(style)],
  contextTypes: {
    draft: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    removeAttribute: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired
  },
  onReorder (event, movedItem, previousIndex, nextIndex, fieldSort) {
    const {draft: {module}, change} = this.context
    const sort = fromPairs(module.sort)

    sort._fields_ = map(fieldSort, 'id')

    change({sort: toPairs(sort)})
  },
  render () {
    const {attributes, removeAttribute, draft: {module: {dimensions, metrics, sort}}} = this.context
    const sortPairs = fromPairs(sort)
    const fields = mountFields(
      attributes,
      dimensions,
      metrics,
      sortPairs._fields_
    )

    const list = map(fields, field => assign(field, {remove: removeAttribute}))

    return (
      <div className='mdl-cell mdl-cell--12-col'>
        <Reorder
          itemKey='id'
          lock='vertical'
          holdTime={300}
          list={list}
          listClass={`${style.list}`}
          itemClass={`${style.item}`}
          template={Field}
          callback={this.onReorder}/>
      </div>
    )
  }
})

export default SelectedFields
