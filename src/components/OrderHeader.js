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
        <VerticalAlign className='mdl-cell mdl-cell--1-offset mdl-cell--4-col'>
          <div>
            <Switch name='auto_budget' label='Auto Budget'/>
          </div>
        </VerticalAlign>
        <div className='mdl-cell mdl-cell--3-col'>
          <Input
            type='number'
            label='investment'
            name='amount'/>
        </div>
      </header>
    )
  }
})

export default OrderHeader
