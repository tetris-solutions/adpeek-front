import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import Selector, {dimensionTypeMap} from './Selector'
import Form from '../../Form'
import {Button, Submit} from '../../Button'
import {loadProductCategoriesAction} from '../../../actions/load-product-categories'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import keyBy from 'lodash/keyBy'
import size from 'lodash/size'
import findIndex from 'lodash/findIndex'
import first from 'lodash/first'
import isEmpty from 'lodash/isEmpty'

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

  listEnabledTypesFor (dimensionType, mappedDimensions) {
    return filter(availableTypes, ({parent, type}) => {
      if (type !== dimensionType && mappedDimensions[type]) {
        return false
      }

      if (!parent) return true

      const {dimensions} = this.state
      const index = findIndex(dimensions, {type: parent})
      const lastOne = size(dimensions) - 1

      return index >= 0 && index < lastOne
    })
  }

  getRemainingTypes () {
    const selected = keyBy(this.state.dimensions, 'type')

    return filter(availableTypes, ({type}) => !selected[type])
  }

  addDimension = () => {
    const next = first(this.getRemainingTypes())

    const dimensions = concat(this.state.dimensions, {
      type: next.type,
      ProductDimensionType: next.category,
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

  }

  render () {
    if (!this.metaDataReady()) {
      return <Message>loadingCategories</Message>
    }

    const {dimensions} = this.state
    const lastOne = size(dimensions) - 1
    const mappedDimensions = keyBy(this.state.dimensions, 'type')

    return (
      <Form onSubmit={this.save}>
        {map(dimensions, (dimension, index) =>
          <Selector
            key={index}
            {...dimension}
            id={index}
            editable={index === lastOne}
            update={this.updateDimension}
            remove={this.removeDimension}
            dimensions={mappedDimensions}
            types={this.listEnabledTypesFor(dimension.type, mappedDimensions)}
            categories={this.props.folder.productCategories}/>)}

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
