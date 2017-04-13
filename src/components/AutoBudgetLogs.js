import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/fp/has'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import filter from 'lodash/filter'
import {Card, Content, Header} from './Card'
import isNumber from 'lodash/isNumber'
import {styledFunctionalComponent} from './higher-order/styled'
import csjs from 'csjs'

const style = csjs`
.actionHeader > small:last-child {
  float: right;
}`
const money = n => isNumber(n) ? '$ ' + n.toFixed(2) : '?'
const budgetPropTypes = PropTypes.shape({
  name: PropTypes.string,
  amount: PropTypes.number,
  external_id: PropTypes.string,
  delivery_method: PropTypes.oneOf(['STANDARD', 'ACCELERATED'])
})
const amountPropTypes = PropTypes.shape({
  previous: PropTypes.number,
  total: PropTypes.number,
  today: PropTypes.number,
  average: PropTypes.number
})

const Timestamp = ({children}, {moment}) => (
  <small>{moment(children).format('LTS')}</small>
)
Timestamp.displayName = 'Timestamp'
Timestamp.propTypes = {
  children: PropTypes.string
}
Timestamp.contextTypes = {
  moment: PropTypes.func
}

const ActionHeader = ({children}) => (
  <h4 className={String(style.actionHeader)}>{children}</h4>
)
ActionHeader.displayName = 'Action-Header'
ActionHeader.propTypes = {
  children: PropTypes.node
}

const DefaultActionComponent = ({message, timestamp}) => (
  <ActionHeader>
    {message}
    <Timestamp>{timestamp}</Timestamp>
  </ActionHeader>
)

DefaultActionComponent.displayName = 'Unknown-Action'
DefaultActionComponent.propTypes = {
  message: PropTypes.string,
  timestamp: PropTypes.string
}

const CalculateBudgetAmount = ({amount, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>calculateBudgetAmountTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>
            <Message>totalAmountTitle</Message>
          </th>
          <th>
            <Message>averageAmountTitle</Message>
          </th>
          <th>
            <Message>previousAmountTitle</Message>
          </th>
          <th>
            <Message>todayAmountTitle</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{money(amount.total)}</td>
          <td>{money(amount.average)}</td>
          <td>{money(amount.previous)}</td>
          <td>{money(amount.today)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

CalculateBudgetAmount.displayName = 'Calculate-Budget-Amount'
CalculateBudgetAmount.propTypes = {
  amount: amountPropTypes,
  timestamp: PropTypes.string
}

const CalculateAdsetAmount = ({amount, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>calculateAdsetAmountTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>
            <Message>totalAmountTitle</Message>
          </th>
          <th>
            <Message>averageAmountTitle</Message>
          </th>
          <th>
            <Message>previousAmountTitle</Message>
          </th>
          <th>
            <Message>todayAmountTitle</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{money(amount.total)}</td>
          <td>{money(amount.average)}</td>
          <td>{money(amount.previous)}</td>
          <td>{money(amount.today)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

CalculateAdsetAmount.displayName = 'Calculate-Adset-Amount'
CalculateAdsetAmount.propTypes = {
  amount: amountPropTypes,
  timestamp: PropTypes.string
}

const LoadCampaignBudget = ({current_budget, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>loadCampaignBudgetTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>ID</th>
          <th className='mdl-data-table__cell--non-numeric'>
            <Message>nameLabel</Message>
          </th>
          <th className='mdl-data-table__cell--non-numeric'>
            <Message>deliveryMethodLabel</Message>
          </th>
          <th>
            <Message>amountLabel</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{current_budget.external_id}</td>
          <td className='mdl-data-table__cell--non-numeric'>
            {current_budget.name}
          </td>
          <td className='mdl-data-table__cell--non-numeric'>
            {current_budget.delivery_method}
          </td>
          <td>{money(current_budget.amount)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

LoadCampaignBudget.displayName = 'Load-Campaign-Budget'
LoadCampaignBudget.propTypes = {
  current_budget: budgetPropTypes,
  timestamp: PropTypes.string
}

const LoadCampaignCost = ({cost, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>loadCampaignCostTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>
            <Message>closedCostTitle</Message>
          </th>
          <th>
            <Message>totalCostTitle</Message>
          </th>
          <th>
            <Message>todayCostTitle</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{money(cost.closed)}</td>
          <td>{money(cost.total)}</td>
          <td>{money(cost.today)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

LoadCampaignCost.displayName = 'Load-Campaign-Cost'
LoadCampaignCost.propTypes = {
  cost: PropTypes.shape({
    closed: PropTypes.number,
    today: PropTypes.number,
    total: PropTypes.number
  }),
  timestamp: PropTypes.string
}

const LoadAdsetCost = ({cost, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>loadAdsetCostTitle</Message>
      {`: ${money(cost.total)}`}
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
  </div>
)

LoadAdsetCost.displayName = 'Load-Adset-Cost'
LoadAdsetCost.propTypes = {
  cost: PropTypes.shape({
    closed: PropTypes.number,
    today: PropTypes.number,
    total: PropTypes.number
  }),
  timestamp: PropTypes.string
}

const LoadAdsetInfo = ({info, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>loadAdsetInfoTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>
            <Message>dailyBudgetTitle</Message>
          </th>
          <th>
            <Message>lifetimeBudgetTitle</Message>
          </th>
          <th>
            <Message>budgetRemainingTitle</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{money(info.daily_budget)}</td>
          <td>{money(info.lifetime_budget)}</td>
          <td>{money(info.budget_remaining)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

LoadAdsetInfo.displayName = 'Load-Adset-Info'
LoadAdsetInfo.propTypes = {
  info: PropTypes.shape({
    daily_budget: PropTypes.number,
    lifetime_budget: PropTypes.number,
    budget_remaining: PropTypes.number
  }),
  timestamp: PropTypes.string
}

const CreateBudget = ({timestamp, budget}) => (
  <div>
    <ActionHeader>
      <Message>createBudgetTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>ID</th>
          <th className='mdl-data-table__cell--non-numeric'>
            <Message>nameLabel</Message>
          </th>
          <th>
            <Message>deliveryMethodLabel</Message>
          </th>
          <th>
            <Message>amountLabel</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{budget.external_id}</td>
          <td className='mdl-data-table__cell--non-numeric'>
            {budget.name}
          </td>
          <td className='mdl-data-table__cell--non-numeric'>
            {budget.delivery_method}
          </td>
          <td>{money(budget.amount)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

CreateBudget.displayName = 'Create-Budget'
CreateBudget.propTypes = {
  timestamp: PropTypes.string,
  budget: budgetPropTypes
}

const SetCampaignBudget = ({timestamp, old_budget, new_budget}) => (
  <div>
    <ActionHeader>
      <Message>setCampaignBudgetTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>ID</th>
          <th className='mdl-data-table__cell--non-numeric'>
            <Message>nameLabel</Message>
          </th>
          <th>
            <Message>deliveryMethodLabel</Message>
          </th>
          <th>
            <Message>amountLabel</Message>
          </th>
        </tr>
      </thead>
      <tbody>
        {old_budget && (
          <tr>
            <td>
              {old_budget.external_id}
            </td>
            <td className='mdl-data-table__cell--non-numeric'>
              {old_budget.name}
            </td>
            <td className='mdl-data-table__cell--non-numeric'>
              {old_budget.delivery_method}
            </td>
            <td>
              {money(old_budget.amount)}
            </td>
          </tr>)}
        <tr>
          <td>
            {new_budget.external_id}
          </td>
          <td className='mdl-data-table__cell--non-numeric'>
            {new_budget.name}
          </td>
          <td className='mdl-data-table__cell--non-numeric'>
            {new_budget.delivery_method}
          </td>
          <td>
            {money(new_budget.amount.today)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

SetCampaignBudget.displayName = 'Set-Campaign-Budget'
SetCampaignBudget.propTypes = {
  timestamp: PropTypes.string,
  old_budget: budgetPropTypes,
  new_budget: PropTypes.shape({
    external_id: PropTypes.string,
    name: PropTypes.string,
    delivery_method: PropTypes.string,
    amount: amountPropTypes
  })
}

const UpdateBudget = ({budget, changes, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>updateBudgetTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>ID</th>

          {changes.name && (
            <th className='mdl-data-table__cell--non-numeric'>
              <Message>nameLabel</Message>
            </th>)}

          {changes.delivery_method && (
            <th>
              <Message>deliveryMethodLabel</Message>
            </th>)}

          {changes.amount && (
            <th>
              <Message>amountLabel</Message>
            </th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {budget.external_id}
          </td>

          {changes.name && (
            <td className='mdl-data-table__cell--non-numeric'>
              {changes.name}
            </td>)}

          {changes.delivery_method && (
            <td className='mdl-data-table__cell--non-numeric'>
              {changes.delivery_method}
            </td>)}

          {changes.amount && (<td>{money(changes.amount)}</td>)}
        </tr>
      </tbody>
    </table>
  </div>
)

UpdateBudget.displayName = 'Update-Budget'
UpdateBudget.propTypes = {
  timestamp: PropTypes.string,
  budget: budgetPropTypes,
  changes: budgetPropTypes
}

const UpdateAdset = ({adset, changes, timestamp}) => (
  <div>
    <ActionHeader>
      <Message>updateAdsetTitle</Message>
      <Timestamp>{timestamp}</Timestamp>
    </ActionHeader>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>ID</th>

          {changes.name && (
            <th className='mdl-data-table__cell--non-numeric'>
              <Message>nameLabel</Message>
            </th>)}

          {changes.delivery_method && (
            <th>
              <Message>deliveryMethodLabel</Message>
            </th>)}

          {changes.amount && (
            <th>
              <Message>amountLabel</Message>
            </th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {adset.external_id}
          </td>

          {changes.name && (
            <td className='mdl-data-table__cell--non-numeric'>
              {changes.name}
            </td>)}

          {changes.delivery_method && (
            <td className='mdl-data-table__cell--non-numeric'>
              {changes.delivery_method}
            </td>)}

          {changes.amount && (<td>{money(changes.amount)}</td>)}
        </tr>
      </tbody>
    </table>
  </div>
)

UpdateAdset.displayName = 'Update-Adset'
UpdateAdset.propTypes = {
  timestamp: PropTypes.string,
  adset: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    external_id: PropTypes.string
  }),
  changes: amountPropTypes
}

const actions = {
  'load-campaign-budget': LoadCampaignBudget,
  'load-campaign-cost': LoadCampaignCost,
  'calculate-budget-amount': CalculateBudgetAmount,
  'create-budget': CreateBudget,
  'update-budget': UpdateBudget,
  'set-campaign-budget': SetCampaignBudget,

  'load-adset-cost': LoadAdsetCost,
  'load-adset-info': LoadAdsetInfo,
  'calculate-adset-amount': CalculateAdsetAmount,
  'update-adset': UpdateAdset
}

function budgetAction (entry, index) {
  const Component = actions[entry.action] || DefaultActionComponent

  return <Component key={index} {...entry} />
}

const Budget = ({entries}) => (
  <Card size='large'>
    <Header>
      <Message name={entries[0].budget.name}>budgetTitle</Message>
    </Header>
    <Content>
      {map(entries, budgetAction)}
    </Content>
  </Card>
)

Budget.displayName = 'Budget-Actions'
Budget.propTypes = {
  entries: PropTypes.array
}

function campaignAction (entry, index) {
  const Component = actions[entry.action] || DefaultActionComponent

  return <Component key={index} {...entry} />
}

const Campaign = ({entries}) => (
  <Card size='large'>
    <Header>
      <Message name={entries[0].campaign.name}>campaignTitle</Message>
    </Header>
    <Content>
      {map(entries, campaignAction)}
    </Content>
  </Card>
)
Campaign.displayName = 'Campaign-Actions'
Campaign.propTypes = {
  entries: PropTypes.array
}

function adSetAction (entry, index) {
  const Component = actions[entry.action] || DefaultActionComponent

  return <Component key={index} {...entry} />
}

const AdSet = ({entries}) => (
  <Card size='large'>
    <Header>
      <Message name={entries[0].adset.name}>adsetTitle</Message>
    </Header>
    <Content>
      {map(entries, adSetAction)}
    </Content>
  </Card>
)

AdSet.displayName = 'AdSet-Actions'
AdSet.propTypes = {
  entries: PropTypes.array
}

function ABLogs ({logs, platform}) {
  if (platform === 'facebook') {
    const adsets = groupBy(logs, 'adset.id')

    return (
      <div>
        {map(adsets, (entries, id) =>
          <AdSet key={id} entries={entries}/>)}
      </div>
    )
  }

  const campaigns = groupBy(filter(logs, has('campaign')), 'campaign.id')
  const budgets = groupBy(filter(logs, has('budget')), 'budget.id')

  return (
    <div>
      {map(campaigns, (entries, id) =>
        <Campaign key={id} entries={entries}/>)}

      {map(budgets, (entries, id) =>
        <Budget key={id} entries={entries}/>)}
    </div>
  )
}
ABLogs.displayName = 'Auto-Budget-Logs'
ABLogs.propTypes = {
  logs: PropTypes.array,
  platform: PropTypes.string
}

export const AutoBudgetLogs = styledFunctionalComponent(ABLogs, style)

export default AutoBudgetLogs
