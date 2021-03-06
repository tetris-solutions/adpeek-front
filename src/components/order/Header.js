import csjs from 'csjs'
import React from 'react'
import PropTypes from 'prop-types'
import OrderDateRange from './DateRange'
import orderType from '../../propTypes/order'
import Input from '../Input'
import Switch from '../Switch'
import VerticalAlign from '../VerticalAlign'
import {styledComponent} from '../higher-order/styled'

const style = csjs`
.card {
  width: 100%;
  margin: 0;
  min-height: 0
}
.inner {
  width: '96%'
  margin: .3em auto;
  padding: 0
}`

class OrderHeader extends React.Component {
  static displayName = 'Order-Header'

  static propTypes = {
    min: PropTypes.number.isRequired,
    change: PropTypes.func,
    order: orderType
  }

  static contextTypes = {
    moment: PropTypes.func.isRequired
  }

  componentWillMount () {
    const {change} = this.props
    this.onChangeValue = ({target: {name, value}}) => change(name, value)
    this.onChangeNumber = ({target: {name, value}}) => change(name, Number(value))
    this.onChangeBoolean = ({target: {checked, name}}) => change(name, checked)
  }

  onChangeRange = ({startDate, endDate}) => {
    this.props.change({
      start: startDate.format('YYYY-MM-DD'),
      end: endDate.format('YYYY-MM-DD')
    })
  }

  render () {
    const {moment} = this.context
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
            <VerticalAlign className='mdl-cell mdl-cell--4-col'>
              <div>
                <OrderDateRange
                  startDate={moment(start)}
                  endDate={moment(end)}
                  buttonClassName='mdl-button'
                  onChange={this.onChangeRange}/>
              </div>
            </VerticalAlign>
            <VerticalAlign className='mdl-cell mdl-cell--2-col'>
              <div>
                <Switch
                  onChange={this.onChangeBoolean}
                  checked={auto_budget}
                  name='auto_budget'
                  label='Auto Budget'/>
              </div>
            </VerticalAlign>
            <div className='mdl-cell mdl-cell--2-col'>
              <Input
                format='currency'
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
}

export default styledComponent(OrderHeader, style)
