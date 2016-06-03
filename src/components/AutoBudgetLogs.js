import React from 'react'
import has from 'lodash/fp/has'
import Message from '@tetris/front-server/lib/components/intl/Message'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import filter from 'lodash/filter'
import {Card, Content, Header} from './Card'
import isNumber from 'lodash/isNumber'
import {styledFnComponent} from './higher-order/styled-fn-component'
import csjs from 'csjs'

const style = csjs`
.actionHeader > small {
  float: right;
}`
const money = n => isNumber(n) ? '$ ' + n.toFixed(2) : '?'

const {PropTypes} = React
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
    today: PropTypes.number,
    total: PropTypes.number
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

const actions = {
  'load-campaign-budget': LoadCampaignBudget,
  'load-campaign-cost': LoadCampaignCost,
  'calculate-budget-amount': CalculateBudgetAmount,
  'create-budget': CreateBudget,
  'update-budget': UpdateBudget,
  'set-campaign-budget': SetCampaignBudget
}

const Budget = ({entries}) => (
  <Card size='large'>
    <Header>
      <Message name={entries[0].budget.name}>budgetTitle</Message>
    </Header>
    <Content>
      {map(entries, (entry, index) => {
        const Component = actions[entry.action] || DefaultActionComponent

        return <Component key={index} {...entry} />
      })}
    </Content>
  </Card>
)

Budget.displayName = 'Budget-Actions'
Budget.propTypes = {
  entries: PropTypes.array
}

const Campaign = ({entries}) => (
  <Card size='large'>
    <Header>
      <Message name={entries[0].campaign.name}>campaignTitle</Message>
    </Header>
    <Content>
      {map(entries, (entry, index) => {
        const Component = actions[entry.action] || DefaultActionComponent

        return <Component key={index} {...entry} />
      })}
    </Content>
  </Card>
)
Campaign.displayName = 'Campaign-Actions'
Campaign.propTypes = {
  entries: PropTypes.array
}

function ABLogs ({logs}) {
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
  logs: PropTypes.array
}

export const AutoBudgetLogs = styledFnComponent(ABLogs, style)

export default AutoBudgetLogs
