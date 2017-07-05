import camelCase from 'lodash/camelCase'

export const inferMsgName = type => camelCase(`PRODUCT_${type}`)

export const productScopeTypes = {
  BIDDING_CATEGORY_L1: {
    scopeClass: 'ProductBiddingCategory',
    valueField: 'value'
  },
  BIDDING_CATEGORY_L2: {
    scopeClass: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L1',
    valueField: 'value'
  },
  BIDDING_CATEGORY_L3: {
    scopeClass: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L2',
    valueField: 'value'
  },
  BIDDING_CATEGORY_L4: {
    scopeClass: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L3',
    valueField: 'value'
  },
  BIDDING_CATEGORY_L5: {
    scopeClass: 'ProductBiddingCategory',
    parent: 'BIDDING_CATEGORY_L4',
    valueField: 'value'
  },
  BRAND: {
    scopeClass: 'ProductBrand',
    valueField: 'value'
  },
  CANONICAL_CONDITION: {
    scopeClass: 'ProductCanonicalCondition',
    valueField: 'condition',
    options: ['NEW', 'USED', 'REFURBISHED']
  },
  CUSTOM_ATTRIBUTE_0: {
    scopeClass: 'ProductCustomAttribute',
    valueField: 'value'
  },
  CUSTOM_ATTRIBUTE_1: {
    scopeClass: 'ProductCustomAttribute',
    valueField: 'value'
  },
  CUSTOM_ATTRIBUTE_2: {
    scopeClass: 'ProductCustomAttribute',
    valueField: 'value'
  },
  CUSTOM_ATTRIBUTE_3: {
    scopeClass: 'ProductCustomAttribute',
    valueField: 'value'
  },
  CUSTOM_ATTRIBUTE_4: {
    scopeClass: 'ProductCustomAttribute',
    valueField: 'value'
  },
  OFFER_ID: {
    scopeClass: 'ProductOfferId',
    valueField: 'value'
  },
  PRODUCT_TYPE_L1: {
    scopeClass: 'ProductType',
    valueField: 'value'
  },
  PRODUCT_TYPE_L2: {
    scopeClass: 'ProductType',
    parent: 'PRODUCT_TYPE_L1',
    valueField: 'value'
  },
  PRODUCT_TYPE_L3: {
    scopeClass: 'ProductType',
    parent: 'PRODUCT_TYPE_L2',
    valueField: 'value'
  },
  PRODUCT_TYPE_L4: {
    scopeClass: 'ProductType',
    parent: 'PRODUCT_TYPE_L3',
    valueField: 'value'
  },
  PRODUCT_TYPE_L5: {
    scopeClass: 'ProductType',
    parent: 'PRODUCT_TYPE_L4',
    valueField: 'value'
  },
  CHANNEL: {
    scopeClass: 'ProductChannel',
    valueField: 'channel',
    options: ['ONLINE', 'LOCAL']
  },
  CHANNEL_EXCLUSIVITY: {
    scopeClass: 'ProductChannelExclusivity',
    valueField: 'channelExclusivity',
    options: ['SINGLE_CHANNEL', 'MULTI_CHANNEL']
  }
}

export const productScopeClasses = {
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
