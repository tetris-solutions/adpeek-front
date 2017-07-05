import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Node, Tree} from '../../Tree'
import map from 'lodash/map'
import find from 'lodash/find'
import get from 'lodash/get'
import {productScopeTypes} from './types'

class PartitionBranch extends React.PureComponent {
  static displayName = 'Partition-Branch'
  static propTypes = {
    children: PropTypes.object,
    parent: PropTypes.object,
    categories: PropTypes.array,
    dimension: PropTypes.shape({
      id: PropTypes.string,
      ProductDimensionType: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }

  static contextTypes = {}

  isCategory () {
    return (
      this.props.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
      this.props.dimension.value
    )
  }

  inferLabel () {
    const {parent, categories, dimension} = this.props

    if (!parent) {
      return <Message>rootPartitionLabel</Message>
    }

    if (this.isCategory()) {
      const category = find(categories, {value: Number(dimension.value)})

      return get(category, 'name', dimension.value)
    }

    const type = productScopeTypes[dimension.type]

    return dimension[type.valueField] || <Message>otherProducts</Message>
  }

  render () {
    return (
      <Node label={this.inferLabel()}>
        <Tree>
          {map(this.props.children, partition =>
            <PartitionBranch
              key={partition.id}
              {...this.props}
              {...partition}/>)}
        </Tree>
      </Node>
    )
  }
}

export default PartitionBranch
