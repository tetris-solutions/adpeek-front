import csjs from 'csjs'
import React from 'react'

import orderType from '../propTypes/order'
import Input from './Input'
import Switch from './Switch'
import VerticalAlign from './VerticalAlign'
import {styled} from './mixins/styled'

const style = csjs`
.card {
  width: 96%;
  margin: 1em auto 0 auto;
  min-height: 0
}
.inner {
  width: '96%';
  margin: .3em auto;
  padding: 0
}`
export const OrderHeader = React.createClass({
  displayName: 'Order-Header',
  mixins: [styled(style)],
  propTypes: {
    min: React.PropTypes.number.isRequired,
    change: React.PropTypes.func,
    order: orderType
  },
  componentWillMount () {
    const {change} = this.props
    this.onChangeValue = ({target: {name, value}}) => change(name, value)
    this.onChangeNumber = ({target: {name, value}}) => change(name, Number(value))
    this.onChangeBoolean = ({target: {checked, name}}) => change(name, checked)
  },
  render () {
    const {min, order: {name, auto_budget, amount, start, end}} = this.props
    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div className={`mdl-card__supporting-text ${style.inner}`}>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--4-col'>
              <Input
                name='name'
                value={name}
                label='orderName'
                onChange={this.onChangeValue}/>
            </div>
            <div className='mdl-cell mdl-cell--2-col'>
              <Input
                type='date'
                value={start}
                label='startDate'
                onChange={this.onChangeValue}
                name='start'/>
            </div>
            <div className='mdl-cell mdl-cell--2-col'>
              <Input
                value={end}
                type='date'
                label='endDate'
                onChange={this.onChangeValue}
                name='end'/>
            </div>
            <VerticalAlign className='mdl-cell mdl-cell--1-offset mdl-cell--2-col'>
              <div>
                <Switch
                  onChange={this.onChangeBoolean}
                  checked={auto_budget}
                  name='auto_budget'
                  label='Auto Budget'/>
              </div>
            </VerticalAlign>
            <div className='mdl-cell mdl-cell--1-col'>
              <Input
                value={amount}
                type='number'
                label='investment'
                min={min}
                onChange={this.onChangeNumber}
                name='amount'/>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default OrderHeader
