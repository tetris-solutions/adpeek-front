import React from 'react'
import PropTypes from 'prop-types'
// import Message from 'tetris-iso/Message'
import Select from '../../Select'
import Input from '../../Input'
import map from 'lodash/map'
import keys from 'lodash/keys'
import camelCase from 'lodash/camelCase'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import get from 'lodash/get'

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

const inferMsgName = type => camelCase(`PRODUCT_${type}`)

export const dimensionTypeMap = {
  BIDDING_CATEGORY_L1: {
    category: 'ProductBiddingCategory',
    parent: null
  },
  BIDDING_CATEGORY_L2: {
    category: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L1'
  },
  BIDDING_CATEGORY_L3: {
    category: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L2'
  },
  BIDDING_CATEGORY_L4: {
    category: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L3'
  },
  BIDDING_CATEGORY_L5: {
    category: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L4'
  },
  BRAND: {category: 'ProductBrand'},
  CANONICAL_CONDITION: {
    category: 'ProductCanonicalCondition',
    parent: null
  },
  CUSTOM_ATTRIBUTE_0: {
    category: 'ProductCustomAttribute',
    parent: null
  },
  CUSTOM_ATTRIBUTE_1: {
    category: 'ProductCustomAttribute',
    parent: null
  },
  CUSTOM_ATTRIBUTE_2: {
    category: 'ProductCustomAttribute',
    parent: null
  },
  CUSTOM_ATTRIBUTE_3: {
    category: 'ProductCustomAttribute',
    parent: null
  },
  CUSTOM_ATTRIBUTE_4: {
    category: 'ProductCustomAttribute',
    parent: null
  },
  OFFER_ID: {
    category: 'ProductOfferId',
    parent: null
  },
  PRODUCT_TYPE_L1: {
    category: 'ProductType',
    parent: null
  },
  PRODUCT_TYPE_L2: {
    category: 'ProductType',
    parent: 'PRODUCT_TYPE_L1'
  },
  PRODUCT_TYPE_L3: {
    category: 'ProductType',
    parent: 'PRODUCT_TYPE_L2'
  },
  PRODUCT_TYPE_L4: {
    category: 'ProductType',
    parent: 'PRODUCT_TYPE_L3'
  },
  PRODUCT_TYPE_L5: {
    category: 'ProductType',
    parent: 'PRODUCT_TYPE_L4'
  },
  CHANNEL: {
    category: 'ProductChannel',
    parent: null
  },
  CHANNEL_EXCLUSIVITY: {
    category: 'ProductChannelExclusivity',
    parent: null
  }
}

class Selector extends React.PureComponent {
  static displayName = 'Product-Scope-Selector'

  static propTypes = {
    editable: PropTypes.bool,
    update: PropTypes.func,
    remove: PropTypes.func,
    categories: PropTypes.array,
    id: PropTypes.number,
    types: PropTypes.array,
    dimensions: PropTypes.object,
    ProductDimensionType: PropTypes.oneOf(keys(dimensionClassMap)),
    type: PropTypes.oneOf(keys(dimensionTypeMap)),
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
      value: null,
      type,
      ProductDimensionType: dimensionTypeMap[type].category
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
    const {
      editable,
      dimensions,
      categories,
      types,
      type,
      ProductDimensionType,
      value
    } = this.props

    const selectedType = (
      type || dimensionClassMap[ProductDimensionType].defaultType
    )

    const typeConfig = dimensionTypeMap[type]
    const inputValue = value || undefined
    let enabledCategories

    if (typeConfig.parent) {
      const parentValue = get(dimensions, [typeConfig.parent, 'value'])

      enabledCategories = parentValue
        ? filter(categories, {type, parent: Number(parentValue)})
        : []
    } else {
      enabledCategories = filter(categories, {type})
    }

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <Select
            disabled={!editable}
            name='type'
            value={selectedType}
            onChange={this.onChangeType}>
            {map(types, ({type}) =>
              <option key={type} value={type}>
                {messages[inferMsgName(type)]}
              </option>)}
          </Select>
        </div>
        <div className='mdl-cell mdl-cell--5-col'>
          {isEmpty(enabledCategories) ? (
            <Input
              disabled={!editable}
              name='value'
              value={inputValue}
              onChange={this.onChangeValue}/>
          ) : (
            <Select disabled={!editable} name='value' value={inputValue} onChange={this.onChangeValue}>
              <option/>
              {map(enabledCategories, ({name, value}) =>
                <option key={value} value={value}>
                  {name}
                </option>)}
            </Select>)}
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <br/>
          {editable ? (
            <a href='' onClick={this.onClickRemove}>
              <i className='material-icons'>remove</i>
            </a>
          ) : (
            <i className='material-icons' style={{cursor: 'not-allowed'}}>
              lock
            </i>
          )}
        </div>
      </div>
    )
  }
}

export default Selector
