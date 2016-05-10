import React from 'react'
import orderType from '../propTypes/order'
import Input from './Input'
import Switch from './Switch'
import VerticalAlign from './VerticalAlign'

export const OrderHeader = React.createClass({
  displayName: 'Order-Header',
  propTypes: {
    change: React.PropTypes.func,
    order: orderType
  },
  componentWillMount () {
    const {change} = this.props
    this.onChangeStart = this.onChangeEnd = ({target: {name, value}}) => change(name, value)
    this.onChangeAmount = ({target: {name, value}}) => change('amount', Number(value))
    this.onChangeBudget = ({target: {checked}}) => change('auto_budget', checked)
  },
  render () {
    const {order: {auto_budget, amount, start, end}} = this.props
    return (
      <header className='mdl-grid'>
        <div className='mdl-cell mdl-cell--3-col'>
          <Input
            type='date'
            value={start}
            label='startDate'
            onChange={this.onChangeStart}
            name='start'/>
        </div>
        <div className='mdl-cell mdl-cell--3-col'>
          <Input
            value={end}
            type='date'
            label='endDate'
            onChange={this.onChangeEnd}
            name='end'/>
        </div>
        <VerticalAlign className='mdl-cell mdl-cell--1-offset mdl-cell--3-col'>
          <div>
            <Switch
              onChange={this.onChangeBudget}
              checked={auto_budget}
              name='auto_budget'
              label='Auto Budget'/>
          </div>
        </VerticalAlign>
        <div className='mdl-cell mdl-cell--2-col'>
          <Input
            value={amount}
            type='number'
            label='investment'
            onChange={this.onChangeAmount}
            name='amount'/>
        </div>
      </header>
    )
  }
})

export default OrderHeader
