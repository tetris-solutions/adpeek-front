import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import Selector, {dimensionTypeMap} from './Selector'
import {loadProductCategoriesAction} from '../../../actions/load-product-categories'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import keyBy from 'lodash/keyBy'
import size from 'lodash/size'
import findIndex from 'lodash/findIndex'

const availableTypes = map(dimensionTypeMap, (d, type) => assign({}, d, {type}))

class ProductScope extends React.Component {
  static displayName = 'Product-Scope'

  static propTypes = {
    folder: PropTypes.shape({
      productCategories: PropTypes.array
    }),
    campaign: PropTypes.shape({
      productScope: ProductScope.array,
      salesCountry: PropTypes.string
    }),
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    dimensions: this.props.campaign.productScope
  }

  componentDidMount () {
    if (!this.metaDataReady()) {
      this.loadMetaData()
    }
  }

  metaDataReady () {
    return Boolean(this.props.folder.productCategories)
  }

  loadMetaData () {
    return this.props.dispatch(
      loadProductCategoriesAction,
      this.props.params,
      this.props.campaign.salesCountry
    )
  }

  updateDimension = (index, changes) => {
    this.setState({
      dimensions: map(this.state.dimensions,
        (d, i) =>
          i === index
            ? assign({}, d, changes)
            : d)
    })
  }

  removeDimension = (index) => {
    const dimensions = concat(this.state.dimensions)

    dimensions.splice(index, 1)

    this.setState({dimensions})
  }

  render () {
    const {dimensions} = this.state
    const lastOne = size(dimensions) - 1
    const enabledTypes = filter(availableTypes, ({parent}) => {
      if (!parent) return true
      const index = findIndex(dimensions, {type: parent})

      return index >= 0 && index < lastOne
    })

    return (
      <div>
        {this.metaDataReady() ? map(dimensions, (dimension, index) =>
          <Selector
            key={index}
            {...dimension}
            id={index}
            editable={index === lastOne}
            update={this.updateDimension}
            remove={this.removeDimension}
            dimensions={keyBy(dimensions, 'type')}
            types={enabledTypes}
            categories={this.props.folder.productCategories}/>)
          : <Message>loadingCategories</Message>}
      </div>
    )
  }
}

export default ProductScope
