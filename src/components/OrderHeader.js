import React from 'react'
import orderType from '../propTypes/order'
import Input from './Input'
import Switch from './Switch'

export const OrderHeader = React.createClass({
  displayName: 'Order-Header',
  propTypes: {
    order: orderType
  },
  render () {
    return (
      <header className='mdl-grid'>
        <div className='mdl-cell mdl-cell--2-col'>
          <Input
            type='date'
            label='Start date'
            name='start'/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <Input
            type='date'
            label='End date'
            name='end'/>
        </div>
        <div className='mdl-cell mdl-cell--5-col'>
          <Switch name='auto_budget' label='Auto Budget'/>
        </div>
        <div className='mdl-cell mdl-cell--3-col'>
          <Input
            type='number'
            label='Investment'
            name='amount'/>
        </div>
      </header>
    )
  }
})

export default OrderHeader
