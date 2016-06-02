import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import moment from 'moment'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import filter from 'lodash/filter'
import {Card, Content, Header} from './Card'
import isNumber from 'lodash/isNumber'
import has from 'lodash/fp/has'

const money = n => isNumber(n) ? '$ ' + n.toFixed(2) : '?'
const {PropTypes} = React
const style = csjs`
`

const yesterday = () => moment().subtract(1, 'day').format('YYYY-MM-DD')

const CalculateBudgetAmount = ({amount}) => (
  <div>
    <h4>Calculado novo orçamento</h4>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>Total</th>
          <th>Médio</th>
          <th>Anterior</th>
          <th>Hoje</th>
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

CalculateBudgetAmount.propTypes = {
  amount: PropTypes.shape({
    previous: PropTypes.number,
    total: PropTypes.number,
    today: PropTypes.number,
    average: PropTypes.number
  })
}

const LoadCampaignBudget = ({current_budget}) => (
  <div>
    <h4>Carregado orçamento</h4>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>ID</th>
          <th className='mdl-data-table__cell--non-numeric'>
            Name
          </th>
          <th className='mdl-data-table__cell--non-numeric'>
            Delivery Method
          </th>
          <th>Amount</th>
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
LoadCampaignBudget.propTypes = {
  current_budget: PropTypes.shape({
    name: PropTypes.string,
    amount: PropTypes.number,
    external_id: PropTypes.string,
    delivery_method: PropTypes.oneOf(['STANDARD', 'ACCELERATED'])
  })
}

const LoadCampaignCost = ({cost}) => (
  <div>
    <h4>Carregado custo</h4>
    <table className='mdl-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th>Fechado</th>
          <th>Total</th>
          <th>Hoje</th>
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

LoadCampaignCost.propTypes = {
  cost: PropTypes.shape({
    today: PropTypes.number,
    total: PropTypes.number
  })
}

const actions = {
  'load-campaign-budget': LoadCampaignBudget,
  'load-campaign-cost': LoadCampaignCost,
  'calculate-budget-amount': CalculateBudgetAmount/*,
   'create-budget',
   'update-budget',
   'set-campaign-budget'*/
}

function Budget ({entries}) {
  return (
    <Card size='large'>
      <Header>Orçamento {entries[0].budget.name}</Header>
      <Content>
        {map(entries, (entry, index) => {
          const Component = actions[entry.action]

          return <Component key={index} {...entry} />
        })}
      </Content>
    </Card>
  )
}
Budget.propTypes = {
  entries: PropTypes.array
}

const Campaign = ({entries}) => (
  <Card size='large'>
    <Header>Campanha {entries[0].campaign.name}</Header>
    <Content>
      {map(entries, (entry, index) => {
        const Component = actions[entry.action]

        return <Component key={index} {...entry} />
      })}
    </Content>
  </Card>
)

Campaign.propTypes = {
  entries: PropTypes.array
}

function AutoBudgetLogs ({logs}) {
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
AutoBudgetLogs.displayName = 'AutoBudgetLogs'
AutoBudgetLogs.propTypes = {
  logs: PropTypes.array
}

export const OrderAutoBudget = React.createClass({
  displayName: 'OrderAutoBudget',
  mixins: [styled(style)],
  contextTypes: {
    router: PropTypes.object
  },
  propTypes: {
    order: PropTypes.object,
    routeParams: PropTypes.object,
    params: PropTypes.object
  },
  onChangeDay (e) {
    const {company, workspace, folder, order} = this.props.params
    const day = e.target.value

    this.context.router.push(
      `/company/${company}/workspace/${workspace}/folder/${folder}/order/${order}/autobudget/${day}`
    )
  },
  render () {
    const {order: {autoBudgetLogs}, routeParams: {day}} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--2-offset mdl-cell--8-col'>
          <Input
            name='day'
            type='date'
            label='day'
            value={day || yesterday()}
            onChange={this.onChangeDay}/>
          <AutoBudgetLogs logs={autoBudgetLogs}/>
        </div>
      </div>
    )
  }
})

export default contextualize(OrderAutoBudget, 'order')
