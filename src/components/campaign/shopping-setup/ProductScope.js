import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Selector from './Selector'
import {loadProductCategoriesAction} from '../../../actions/load-product-categories'
import assign from 'lodash/assign'
import concat from 'lodash/concat'

class ProductScope extends React.PureComponent {
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
    const categories = this.props.folder.productCategories

    return (
      <div>
        {map(this.state.dimensions, (dimension, index) =>
          <Selector
            key={index}
            update={this.updateDimension}
            remove={this.removeDimension}
            categories={categories}
            id={index}
            {...dimension}/>)}
      </div>
    )
  }
}

export default ProductScope
