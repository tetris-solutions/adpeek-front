import React from 'react'
import budgetType from '../propTypes/budget'
import Slide from './Slide'
import Switch from './Switch'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import VerticalAlign from './VerticalAlign'
import {Card, Content} from './Card'
const {PropTypes} = React
import map from 'lodash/map'

export const BudgetEdit = React.createClass({
  displayName: 'Budget-Edit',
  propTypes: {
    changeMode: PropTypes.func,
    changeValue: PropTypes.func,
    maxAmount: PropTypes.number,
    budget: budgetType,
    messages: PropTypes.object
  },
  onChangeMode ({target: {checked}}) {
    this.props.changeMode(checked ? 'percentage' : 'amount')
  },
  onChangeValue ({target: {value}}) {
    this.props.changeValue(Number(value))
  },
  render () {
    const {
      maxAmount,
      messages: {percentageLabel, amountLabel},
      budget: {value, mode, campaigns}
    } = this.props

    let max, min, switchLabel, switchChecked

    min = 0

    if (mode === 'percentage') {
      switchChecked = true
      max = 100
      switchLabel = percentageLabel
    } else {
      switchChecked = false
      max = maxAmount
      switchLabel = amountLabel
    }

    return (
      <Card size='large'>
        <Content>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <Switch checked={switchChecked} onChange={this.onChangeMode} label={switchLabel}/>
            </div>
            <VerticalAlign className='mdl-cell mdl-cell--8-col'>
              <Slide
                onChange={this.onChangeValue}
                value={value}
                max={max}
                min={min}/>
            </VerticalAlign>

            <div className='mdl-cell mdl-cell--4-col'>
              <Input
                onChange={this.onChangeValue}
                value={value}
                type='number'
                label='value'
                name='value'/>
            </div>
          </div>
          <ul>
            {map(campaigns, ({name}) => <li>{name}</li>)}
          </ul>
        </Content>
      </Card>
    )
  }
})

export default contextualize(BudgetEdit, 'messages')
