import React from 'react'
import budgetType from '../propTypes/budget'
import Slide from './Slide'
import Switch from './Switch'
import Input from './Input'
import VerticalAlign from './VerticalAlign'
import {Card, Content, Header, Footer} from './Card'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import campaignType from '../propTypes/campaign'
import size from 'lodash/size'
import Select from './Select'
import {branch} from 'baobab-react/higher-order'
import filter from 'lodash/filter'
import {Tabs, Tab} from './Tabs'

const {PropTypes} = React

function Campaign ({campaign, actionIcon, onClick}) {
  function onIconClick (e) {
    e.preventDefault()
    onClick(campaign)
  }

  return (
    <div className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar' title={campaign.status.description}>
          {campaign.status.icon}
        </i>
        <span>{campaign.name}</span>
      </span>
      <a className='mdl-list__item-secondary-action' onClick={onIconClick}>
        <i className='material-icons'>{actionIcon}</i>
      </a>
    </div>
  )
}

Campaign.displayName = 'Campaign'
Campaign.propTypes = {
  campaign: campaignType,
  actionIcon: PropTypes.string,
  onClick: PropTypes.func
}

const notUnknown = ({id}) => id !== 'UNKNOWN'

export const BudgetEdit = React.createClass({
  displayName: 'Budget-Edit',
  propTypes: {
    close: PropTypes.func,
    remove: PropTypes.func,
    deliveryMethods: PropTypes.array,
    removeCampaign: PropTypes.func,
    change: PropTypes.func,
    max: PropTypes.number,
    budget: budgetType,
    folderCampaigns: PropTypes.array,
    showFolderCampaigns: PropTypes.bool,
    addCampaigns: PropTypes.func
  },
  contextTypes: {
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
  onChangeDeliveryMethod ({target: {value}}) {
    this.props.change('delivery_method', value)
  },
  render () {
    const {messages: {percentageLabel, amountLabel, folderCampaignsTitle, budgetCampaignsTitle}} = this.context
    const {
      folderCampaigns,
      showFolderCampaigns,
      addCampaigns,
      remove,
      close,
      deliveryMethods,
      max,
      budget: {name, value, mode, campaigns, delivery_method}
    } = this.props

    let switchLabel, switchChecked

    if (mode === 'percentage') {
      switchChecked = true
      switchLabel = percentageLabel
    } else {
      switchChecked = false
      switchLabel = amountLabel
    }

    function includeCampaign ({id}) {
      addCampaigns([id])
    }

    return (
      <Card size='large'>
        <Header>
          <Message>editBudgetHeader</Message>
        </Header>
        <Content>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--7-col'>
              <Input
                onChange={this.onChangeName}
                value={name}
                label='budgetName'
                name='name'/>
            </div>
            <div className='mdl-cell mdl-cell--5-col'>
              <Select
                name='delivery_method'
                label='deliveryMethod'
                value={delivery_method}
                onChange={this.onChangeDeliveryMethod}>

                {map(filter(deliveryMethods, notUnknown), ({id, name}, index) =>
                  <option key={index} value={id}>{name}</option>)}

              </Select>
            </div>
          </div>

          <div className='mdl-grid'>
            <VerticalAlign className='mdl-cell mdl-cell--3-col'>
              <br/>
              <Switch checked={switchChecked} onChange={this.onChangeMode} label={switchLabel}/>
            </VerticalAlign>

            <VerticalAlign className='mdl-cell mdl-cell--6-col'>
              <Slide
                onChange={this.onChangeValue}
                value={value}
                max={max}
                min={1}/>
            </VerticalAlign>

            <div className='mdl-cell mdl-cell--3-col'>
              <Input
                onChange={this.onChangeValue}
                value={value}
                type='number'
                label='value'
                name='value'/>
            </div>
          </div>

          <Tabs>
            <Tab id='budget-campaigns' title={budgetCampaignsTitle}>
              <br/>
              {!size(campaigns) ? (
                <Message html>budgetWithoutCampaigns</Message>
              ) : (
                <div className='mdl-list'>
                  {map(campaigns, campaign => (
                    <Campaign
                      key={campaign.id}
                      campaign={campaign}
                      actionIcon='clear'
                      onClick={this.props.removeCampaign}/>
                  ))}
                </div>)}
            </Tab>
            <Tab id='folder-campaigns' title={folderCampaignsTitle}>
              <br/>
              {!showFolderCampaigns ? (
                <Message html>maxCampaignsPerBudgetReached</Message>
              ) : (
                <div className='mdl-list'>
                  {map(folderCampaigns, campaign => (
                    <Campaign
                      key={campaign.id}
                      campaign={campaign}
                      actionIcon='add'
                      onClick={includeCampaign}/>
                  ))}
                </div>)}
            </Tab>
          </Tabs>
        </Content>
        <Footer multipleButtons>
          <button className='mdl-button mdl-button--colored' onClick={remove}>
            <Message>removeBudget</Message>
          </button>
          <button className='mdl-button mdl-button--colored' onClick={close}>
            <Message>close</Message>
          </button>
        </Footer>
      </Card>
    )
  }
})

export default branch({deliveryMethods: ['deliveryMethods']}, BudgetEdit)
