import React from 'react'
import PropTypes from 'prop-types'
import {loadCampaignProductScopeAction} from '../../../actions/load-campaign-product-scope'

class ProductScope extends React.PureComponent {
  static displayName = 'Product-Scope'

  static propTypes = {
    folder: PropTypes.object,
    campaign: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  componentDidMount () {
    if (!this.scopeReady()) {
      this.loadScope()
    }
  }

  scopeReady () {
    return Boolean(this.props.campaign.productScope)
  }

  loadScope () {
    return this.props.dispatch(loadCampaignProductScopeAction, this.props.params)
  }

  render () {
    return (
      <div/>
    )
  }
}

export default ProductScope
