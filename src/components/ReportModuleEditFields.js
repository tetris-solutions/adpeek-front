import assign from 'lodash/assign'
import concat from 'lodash/concat'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import React from 'react'

function Field ({name, remove, id}) {
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired
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
      const foundIndex = findIndex(fieldSort, field.id)
      return assign(field, {index: foundIndex === -1 ? Infinity : foundIndex})
    }), ['index', 'isMetric'])
}

const isFieldSort = ([a, b]) => a === '_fields_'

const Fields = React.createClass({
  displayName: 'Fields',
  propTypes: {
    module: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  },
  render () {
    const {attributes, module: {dimensions, metrics, sort}} = this.props
    const fields = mountFields(
      attributes,
      dimensions,
      metrics,
      find(sort, isFieldSort)
    )

    return (
      <div className='mdl-cell mdl-cell--12-col'>
        {map(fields, field =>
          <Field key={field.id} remove={this.props.remove} {...field}/>)}
      </div>
    )
  }
})

export default Fields
