import React from 'react'
import budgetType from '../propTypes/budget'
import Slide from './Slide'
import Switch from './Switch'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import VerticalAlign from './VerticalAlign'
import {Card, Content, Header} from './Card'
const {PropTypes} = React
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'

export const BudgetEdit = React.createClass({
  displayName: 'Budget-Edit',
  propTypes: {
    change: PropTypes.func,
    maxAmount: PropTypes.number,
    budget: budgetType,
    messages: PropTypes.object
  },
  onChangeMode ({target: {checked}}) {
    this.props.change('mode', checked ? 'percentage' : 'amount')
  },
  onChangeValue ({target: {value}}) {
    this.props.change('value', Number(value))
  },
  onChangeName ({target: {value}}) {
    this.props.change('name', value)
  },
  render () {
    const {
      maxAmount,
      messages: {percentageLabel, amountLabel},
      budget: {name, value, mode, campaigns}
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
        <Header>
          <Message>editBudgetHeader</Message>
        </Header>
        <Content>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--8-col'>
              <Input
                onChange={this.onChangeName}
                value={name}
                label='name'
                name='name'/>
            </div>
            <VerticalAlign className='mdl-cell mdl-cell--4-col'>
              <Switch checked={switchChecked} onChange={this.onChangeMode} label={switchLabel}/>
            </VerticalAlign>
          </div>

          <div className='mdl-grid'>
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
            {map(campaigns,
              ({name, id}) => <li key={id}>{name}</li>)}
          </ul>
        </Content>
      </Card>
    )
  }
})

export default contextualize(BudgetEdit, 'messages')
