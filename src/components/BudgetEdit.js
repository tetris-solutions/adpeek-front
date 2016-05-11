import React from 'react'
import budgetType from '../propTypes/budget'
import Slide from './Slide'
import Switch from './Switch'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import VerticalAlign from './VerticalAlign'
import {Card, Content, Header} from './Card'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import campaignType from '../propTypes/campaign'
import size from 'lodash/size'

const {PropTypes} = React

function Campaign ({campaign, removeCampaign}) {
  function onClick (e) {
    e.preventDefault()
    removeCampaign(campaign)
  }

  return (
    <div className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar'>{campaign.status.icon}</i>
        <span>{campaign.name}</span>
      </span>
      <a className='mdl-list__item-secondary-action' onClick={onClick}>
        <i className='material-icons'>clear</i>
      </a>
    </div>
  )
}

Campaign.displayName = 'Campaign'
Campaign.propTypes = {
  campaign: campaignType,
  removeCampaign: PropTypes.func
}

export const BudgetEdit = React.createClass({
  displayName: 'Budget-Edit',
  propTypes: {
    removeCampaign: PropTypes.func,
    change: PropTypes.func,
    max: PropTypes.number,
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
      max,
      messages: {percentageLabel, amountLabel},
      budget: {name, value, mode, campaigns}
    } = this.props

    let switchLabel, switchChecked

    if (mode === 'percentage') {
      switchChecked = true
      switchLabel = percentageLabel
    } else {
      switchChecked = false
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
                label='budgetName'
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
                min={1}/>
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

          <h5>
            <Message>budgetCampaigns</Message>
          </h5>

          {!size(campaigns) && <Message html>budgetWithoutCampaigns</Message>}

          <div className='mdl-list'>
            {map(campaigns, campaign => (
              <Campaign
                key={campaign.id}
                campaign={campaign}
                removeCampaign={this.props.removeCampaign}/>
            ))}
          </div>
        </Content>
      </Card>
    )
  }
})

export default contextualize(BudgetEdit, 'messages')
