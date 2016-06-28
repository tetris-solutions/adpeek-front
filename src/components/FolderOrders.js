import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

const {PropTypes} = React

export const FolderOrders = React.createClass({
  displayName: 'Folder-Orders',
  propTypes: {
    folder: PropTypes.shape({
      orders: PropTypes.array
    })
  },
  render () {
    return <Orders orders={this.props.folder.orders}/>
  }
})

export default contextualize(FolderOrders, 'folder')
