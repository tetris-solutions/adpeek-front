import concat from 'lodash/concat'
import csjs from 'csjs'
import fromPairs from 'lodash/fromPairs'
import indexOf from 'lodash/indexOf'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import toPairs from 'lodash/toPairs'
import React from 'react'
import PropTypes from 'prop-types'
import Reorder, {reorder} from 'react-reorder'
import {Button} from '../../Button'
import {styledComponent} from '../../higher-order/styled'

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

class SelectedFields extends React.Component {
  static displayName = 'Selected-Fields'

  static contextTypes = {
    draft: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    removeAttribute: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired
  }

  getFields () {
    const {attributes, draft: {module: {dimensions, metrics, sort}}} = this.context
    const sortPairs = fromPairs(sort)
    return mountFields(
      attributes,
      dimensions,
      metrics,
      sortPairs._fields_
    )
  }

  onReorder = (event, previousIndex, nextIndex) => {
    const {draft: {module}, change} = this.context
    const fieldSort = this.getFields()
    const sort = fromPairs(module.sort)

    sort._fields_ = reorder(map(fieldSort, 'id'), previousIndex, nextIndex)

    change({sort: toPairs(sort)})
  }

  render () {
    const {removeAttribute, draft: {module: {id}}} = this.context
    const fields = this.getFields()

    return (
      <div className='mdl-cell mdl-cell--12-col'>
        <Reorder
          reorderId={`fields-${id}`}
          lock='vertical'
          holdTime={300}
          className={style.list}
          onReorder={this.onReorder}>
          {map(fields, ({id, name, remove}) => (
            <span key={id} className={`mdl-chip mdl-chip--deletable ${style.item}`}>
              <span className='mdl-chip__text'>{name}</span>
              <Button className='mdl-chip__action' onClick={() => removeAttribute(id, true)}>
                <i className='material-icons'>cancel</i>
              </Button>
            </span>
          ))}
        </Reorder>
      </div>
    )
  }
}

export default styledComponent(SelectedFields, style)
