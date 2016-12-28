import filter from 'lodash/filter'
import map from 'lodash/map'
import size from 'lodash/size'
import Message from 'tetris-iso/Message'
import React from 'react'
import {Button} from './Button'
import {branch} from 'baobab-react/higher-order'
import budgetType from '../propTypes/budget'
import Input from './Input'
import Select from './Select'
import Slide from './Slide'
import Switch from './Switch'
import VerticalAlign from './VerticalAlign'
import {Card, Content, Header, Footer} from './Card'
import {Tabs, Tab} from './Tabs'
import BudgetCampaign from './BudgetCampaign'
import BudgetEditFolderCampaigns from './BudgetEditFolderCampaigns'

const notUnknown = ({id}) => id !== 'UNKNOWN'

export const BudgetEdit = React.createClass({
  displayName: 'Budget-Edit',
  propTypes: {
    close: React.PropTypes.func,
    remove: React.PropTypes.func,
    deliveryMethods: React.PropTypes.array,
    removeCampaign: React.PropTypes.func,
    change: React.PropTypes.func,
    max: React.PropTypes.number,
    budget: budgetType,
    folderCampaigns: React.PropTypes.array,
    showFolderCampaigns: React.PropTypes.bool,
    addCampaigns: React.PropTypes.func
  },
  contextTypes: {
    messages: React.PropTypes.object
  },
  onChangeMode ({target: {checked}}) {
    this.props.change('mode', checked ? 'percentage' : 'amount')
  },
  onChangeValue ({target: input}) {
    return this.props.change('value', Number(input.value))
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
      budget: {value, name, mode, campaigns, delivery_method}
    } = this.props

    const percentageMode = mode === 'percentage'
    let switchLabel, switchChecked

    if (percentageMode) {
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
      <Card size='full'>
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
                step={0.1}
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
                format={percentageMode ? 'percentage' : 'currency'}
                label='value'
                name='value'
                max={max}
                min={1}/>
            </div>
          </div>

          <Tabs>
            <Tab id='budget-campaigns' title={budgetCampaignsTitle}>
              <br/>
              {!size(campaigns) ? <Message html>budgetWithoutCampaigns</Message> : (
                <div className='mdl-list'>
                  {map(campaigns, campaign => (
                    <BudgetCampaign
                      key={campaign.id}
                      campaign={campaign}
                      actionIcon='clear'
                      onClick={this.props.removeCampaign}/>
                  ))}
                </div>)}
            </Tab>
            <Tab id='folder-campaigns' title={folderCampaignsTitle}>
              <br/>
              {!showFolderCampaigns
                ? <Message html>maxCampaignsPerBudgetReached</Message>
                : <BudgetEditFolderCampaigns campaigns={folderCampaigns} add={includeCampaign}/>}
            </Tab>
          </Tabs>
        </Content>
        <Footer multipleButtons>
          <Button className='mdl-button mdl-button--colored' onClick={remove}>
            <Message>remove</Message>
          </Button>
          <Button className='mdl-button mdl-button--colored' onClick={close}>
            <Message>close</Message>
          </Button>
        </Footer>
      </Card>
    )
  }
})

export default branch({deliveryMethods: ['deliveryMethods']}, BudgetEdit)
