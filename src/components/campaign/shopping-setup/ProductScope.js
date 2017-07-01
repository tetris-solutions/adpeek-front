import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'

class ProductScope extends React.PureComponent {
  static displayName = 'Product-Scope'

  static propTypes = {
    folder: PropTypes.object,
    campaign: PropTypes.shape({
      productScope: ProductScope.array
    }),
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  render () {
    return (
      <div>
        {map(this.props.campaign.productScope,
          ({ProductDimensionType, value}) =>
            <div>
              <strong>{ProductDimensionType}:</strong>

              {' ' + value}
            </div>)}
      </div>
    )
  }
}

export default ProductScope
