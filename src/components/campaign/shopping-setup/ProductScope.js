import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import ProductScopeEditor from './ProductScopeEditor'
import {productScopeTypes, productScopeClasses} from './types'
import Form from '../../Form'
import {Button, Submit} from '../../Button'
import {updateCampaignProductScopeAction} from '../../../actions/update-campaign-product-scope'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import keyBy from 'lodash/keyBy'
import size from 'lodash/size'
import findIndex from 'lodash/findIndex'
import first from 'lodash/first'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

const availableTypes = map(productScopeTypes, (d, type) =>
  assign({}, d, {type}))

class ProductScope extends React.Component {
  static displayName = 'Product-Scope'

  static propTypes = {
    folder: PropTypes.shape({
      productCategories: PropTypes.array.isRequired
    }),
    campaign: PropTypes.shape({
      productScope: ProductScope.array,
      salesCountry: PropTypes.string
    }),
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    dimensions: filter(this.props.campaign.productScope, ({type, ProductDimensionType}) => (
      productScopeTypes[type] ||
      get(productScopeClasses, [ProductDimensionType, 'defaultType'])
    ))
  }

  getRemainingTypes () {
    const selected = keyBy(this.state.dimensions, 'type')

    return filter(availableTypes, ({type}) => !selected[type])
  }

  addDimension = () => {
    const next = first(this.getRemainingTypes())

    const dimensions = concat(this.state.dimensions, {
      type: next.type,
      ProductDimensionType: next.scopeClass,
      value: null
    })

    this.setState({dimensions})
  }

  updateDimension = (index, changes) => {
    this.setState({
      dimensions: map(this.state.dimensions,
        (d, i) => i === index
          ? assign({}, d, changes)
          : d)
    })
  }

  removeDimension = (index) => {
    const dimensions = concat(this.state.dimensions)

    dimensions.splice(index, 1)

    this.setState({dimensions})
  }

  save = () => {
    return this.props.dispatch(
      updateCampaignProductScopeAction,
      this.props.params,
      this.state.dimensions
    )
  }

  indexOfDimension (type) {
    return findIndex(this.state.dimensions, {type})
  }

  dimensionTransformer = () => {
    const categories = this.props.folder.productCategories
    const {dimensions} = this.state
    const lastOne = size(dimensions) - 1
    const selectedDimensions = keyBy(dimensions, 'type')

    return (currentDimension, myIndex) => {
      const config = productScopeTypes[currentDimension.type]

      const scope = assign({ProductDimensionType: config.scopeClass}, currentDimension, {
        id: myIndex,
        config,
        categories,
        editable: myIndex === lastOne,
        update: this.updateDimension,
        remove: this.removeDimension,
        parentScope: selectedDimensions[config.parent]
      })

      scope.types = filter(availableTypes, ({parent, type}) => {
        const isCurrentType = type === scope.type
        const alreadySelected = Boolean(selectedDimensions[type])
        const parentTypeIndex = parent ? this.indexOfDimension(type) : 0
        const parentTypeIsSelected = parentTypeIndex >= 0
        const parentTypeIsAbove = parentTypeIndex <= myIndex

        return isCurrentType ||
          (
            !alreadySelected &&
            parentTypeIsSelected &&
            parentTypeIsAbove
          )
      })

      return scope
    }
  }

  render () {
    const transform = this.dimensionTransformer()

    return (
      <Form onSubmit={this.save}>
        {map(this.state.dimensions,
          (dimension, index) =>
            <ProductScopeEditor key={index} {...transform(dimension, index)}/>)}
        <hr/>
        <div>
          <Button
            className='mdl-button'
            disabled={isEmpty(this.getRemainingTypes())}
            onClick={this.addDimension}>
            <Message>newFilter</Message>
          </Button>
          <Submit className='mdl-button' style={{float: 'right'}}>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default ProductScope
