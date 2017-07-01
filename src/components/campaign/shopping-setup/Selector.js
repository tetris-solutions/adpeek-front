import React from 'react'
import PropTypes from 'prop-types'
// import Message from 'tetris-iso/Message'
import Select from '../../Select'
import Input from '../../Input'
import map from 'lodash/map'
import keys from 'lodash/keys'
import camelCase from 'lodash/camelCase'

const dimensionClassMap = {
  ProductBiddingCategory: {
    defaultType: 'BIDDING_CATEGORY_L1'
  },
  ProductBrand: {
    defaultType: 'BRAND'
  },
  ProductCanonicalCondition: {
    defaultType: 'CANONICAL_CONDITION'
  },
  ProductChannel: {
    defaultType: 'CHANNEL'
  },
  ProductChannelExclusivity: {
    defaultType: 'CHANNEL_EXCLUSIVITY'
  },
  ProductCustomAttribute: {
    defaultType: 'CUSTOM_ATTRIBUTE_0'
  },
  ProductOfferId: {
    defaultType: 'OFFER_ID'
  },
  ProductType: {
    defaultType: 'PRODUCT_TYPE_L1'
  }
}

const dimensionClasses = keys(dimensionClassMap)
const inferMsgName = type => camelCase(`PRODUCT_${type}`)

const dimensionTypeMap = {
  BIDDING_CATEGORY_L1: 'ProductBiddingCategory',
  BIDDING_CATEGORY_L2: 'ProductBiddingCategory',
  BIDDING_CATEGORY_L3: 'ProductBiddingCategory',
  BIDDING_CATEGORY_L4: 'ProductBiddingCategory',
  BIDDING_CATEGORY_L5: 'ProductBiddingCategory',
  BRAND: 'ProductBrand',
  CANONICAL_CONDITION: 'ProductCanonicalCondition',
  CUSTOM_ATTRIBUTE_0: 'ProductCustomAttribute',
  CUSTOM_ATTRIBUTE_1: 'ProductCustomAttribute',
  CUSTOM_ATTRIBUTE_2: 'ProductCustomAttribute',
  CUSTOM_ATTRIBUTE_3: 'ProductCustomAttribute',
  CUSTOM_ATTRIBUTE_4: 'ProductCustomAttribute',
  OFFER_ID: 'ProductOfferId',
  PRODUCT_TYPE_L1: 'ProductType',
  PRODUCT_TYPE_L2: 'ProductType',
  PRODUCT_TYPE_L3: 'ProductType',
  PRODUCT_TYPE_L4: 'ProductType',
  PRODUCT_TYPE_L5: 'ProductType',
  CHANNEL: 'ProductChannel',
  CHANNEL_EXCLUSIVITY: 'ProductChannelExclusivity'
}

const dimensionTypes = keys(dimensionTypeMap)

class Selector extends React.PureComponent {
  static displayName = 'Product-Scope-Selector'

  static propTypes = {
    update: PropTypes.func,
    remove: PropTypes.func,
    categories: PropTypes.array,
    id: PropTypes.number,
    ProductDimensionType: PropTypes.oneOf(dimensionClasses),
    type: PropTypes.oneOf(dimensionTypes),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  onChangeType = ({target: {value: type}}) => {
    this.props.update(this.props.id, {
      type,
      ProductDimensionType: dimensionTypeMap[type]
    })
  }

  onChangeValue = ({target: {value}}) => {
    this.props.update(this.props.id, {value})
  }

  onClickRemove = e => {
    e.preventDefault()

    this.props.remove(this.props.id)
  }

  render () {
    const {messages} = this.context
    const type = (
      this.props.type ||
      dimensionClassMap[this.props.ProductDimensionType].defaultType
    )

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <Select
            name='type'
            value={type}
            onChange={this.onChangeType}>
            {map(dimensionTypes, type =>
              <option key={type} value={type}>
                {messages[inferMsgName(type)]}
              </option>)}
          </Select>
        </div>
        <div className='mdl-cell mdl-cell--5-col'>
          <Input
            name='value'
            value={this.props.value}
            onChange={this.onChangeValue}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <a href='' onClick={this.onClickRemove}>
            <i className='material-icons'>remove</i>
          </a>
        </div>
      </div>
    )
  }
}

export default Selector
