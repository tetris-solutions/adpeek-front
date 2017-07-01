import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Selector from './Selector'
import {loadFolderProductCategoryMetaDataAction} from '../../../actions/load-folder-product-category-meta-data'
import assign from 'lodash/assign'
import concat from 'lodash/concat'

class ProductScope extends React.PureComponent {
  static displayName = 'Product-Scope'

  static propTypes = {
    folder: PropTypes.shape({
      productCategoryMetaData: PropTypes.array
    }),
    campaign: PropTypes.shape({
      productScope: ProductScope.array
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
    return Boolean(this.props.folder.productCategoryMetaData)
  }

  loadMetaData () {
    return this.props.dispatch(loadFolderProductCategoryMetaDataAction, this.props.params)
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
    const metaData = this.props.folder.productCategoryMetaData

    return (
      <div>
        {map(this.state.dimensions, (dimension, index) =>
          <Selector
            key={index}
            update={this.updateDimension}
            remove={this.removeDimension}
            metaData={metaData}
            id={index}
            {...dimension}/>)}
      </div>
    )
  }
}

export default ProductScope
