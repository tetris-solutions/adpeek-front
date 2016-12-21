import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

const {PropTypes} = React

export const FolderOrders = React.createClass({
  displayName: 'Folder-Orders',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    folder: PropTypes.shape({
      orders: PropTypes.array
    }).isRequired
  },
  render () {
    const {dispatch, folder: {orders}} = this.props

    return <Orders dispatch={dispatch} orders={orders}/>
  }
})

export default contextualize(FolderOrders, 'folder')
