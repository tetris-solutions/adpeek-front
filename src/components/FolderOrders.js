import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

export const FolderOrders = React.createClass({
  displayName: 'Folder-Orders',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    folder: React.PropTypes.shape({
      orders: React.PropTypes.array
    }).isRequired
  },
  render () {
    const {dispatch, folder: {orders}} = this.props

    return <Orders dispatch={dispatch} orders={orders}/>
  }
})

export default contextualize(FolderOrders, 'folder')
