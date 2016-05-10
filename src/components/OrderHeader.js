import React from 'react'
import orderType from '../propTypes/order'
import Input from './Input'
import Switch from './Switch'
import VerticalAlign from './VerticalAlign'

export const OrderHeader = React.createClass({
  displayName: 'Order-Header',
  propTypes: {
    order: orderType
  },
  render () {
    const {order: {amount, start, end}} = this.props
    return (
      <header className='mdl-grid'>
        <div className='mdl-cell mdl-cell--3-col'>
          <Input
            type='date'
            value={start}
            label='startDate'
            name='start'/>
        </div>
        <div className='mdl-cell mdl-cell--3-col'>
          <Input
            value={end}
            type='date'
            label='endDate'
            name='end'/>
        </div>
        <VerticalAlign className='mdl-cell mdl-cell--1-offset mdl-cell--3-col'>
          <div>
            <Switch name='auto_budget' label='Auto Budget'/>
          </div>
        </VerticalAlign>
        <div className='mdl-cell mdl-cell--2-col'>
          <Input
            value={amount}
            type='number'
            label='investment'
            name='amount'/>
        </div>
      </header>
    )
  }
})

export default OrderHeader
