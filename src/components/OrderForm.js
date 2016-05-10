import React from 'react'
import OrderPie from './OrderPie'

import campaignType from '../propTypes/campaign'
import orderType from '../propTypes/campaign'
import budgetType from '../propTypes/campaign'

import OrderHeader from './OrderHeader'
import BudgetEdit from './BudgetEdit'
import OrderCampaigns from './OrderCampaigns'

const {PropTypes} = React

export const OrderForm = React.createClass({
  displayName: 'Order-Form',
  propTypes: {
    addCampaigns: PropTypes.func,
    selectBudget: PropTypes.func,
    changeField: PropTypes.func,
    order: orderType,
    campaigns: PropTypes.arrayOf(campaignType),
    budget: budgetType
  },
  render () {
    const {
      selectBudget,
      changeField,
      addCampaigns,
      budget,
      order,
      campaigns
    } = this.props

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--5-col'>
            <br/>
            <OrderPie order={order} selectBudget={selectBudget}/>
          </div>
          <div className='mdl-cell mdl-cell--7-col'>
            <OrderHeader order={order}/>

            {budget ? (
              <BudgetEdit
                maxAmount={order.amount}
                budget={budget}
                change={changeField}/>
            ) : null}
          </div>
        </div>

        {budget ? (
          <OrderCampaigns
            campaigns={campaigns}
            addCampaigns={addCampaigns}/>
        ) : null}
      </div>
    )
  }
})

export default OrderForm
