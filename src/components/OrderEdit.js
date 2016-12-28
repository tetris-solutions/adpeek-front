import some from 'lodash/some'
import Message from 'tetris-iso/Message'
import React from 'react'
import budgetType from '../propTypes/budget'
import campaignType from '../propTypes/campaign'
import orderType from '../propTypes/order'
import BudgetEdit from './BudgetEdit'
import EmptySelectionCard from './BudgetEmptySelection'
import OrderHeader from './OrderHeader'
import OrderPie from './OrderPie'
import OrderSpawnAutoBudget from './OrderSpawnAutoBudget'
import Fence from './Fence'
import SubHeader from './SubHeader'
import Page from './Page'
import {Button} from './Button'
const notPercentage = budget => budget && budget.mode === 'amount'

export function OrderEdit ({
  save,
  runAutoBudget,
  showFolderCampaigns,
  createBudget,
  removeBudget,
  removeCampaign,
  remainingValue,
  remainingAmount,
  addCampaigns,
  selectBudget,
  changeOrderField,
  changeBudgetField,
  budget,
  order,
  folderCampaigns
}) {
  function closeBudget () {
    selectBudget(null)
  }

  return (
    <div>
      <Fence canEditOrder>{({canEditOrder}) =>
        <SubHeader>
          {canEditOrder && Boolean(order.id) && (
            <OrderSpawnAutoBudget runAutoBudget={runAutoBudget}/>)}

          {canEditOrder && <Button onClick={save} className='mdl-button mdl-color-text--grey-100'>
            <Message>save</Message>
          </Button>}
        </SubHeader>}
      </Fence>

      <Page>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <OrderHeader
              min={some(order.budgets, notPercentage) ? Math.max(1, order.amount - remainingValue) : 1}
              change={changeOrderField}
              order={order}/>
          </div>
          <div className='mdl-cell mdl-cell--5-col'>
            <OrderPie
              selectedBudgetId={budget ? budget.id : null}
              remainingAmount={remainingAmount}
              order={order}
              selectBudget={selectBudget}/>
          </div>
          <div className='mdl-cell mdl-cell--7-col'>
            {budget ? (
              <BudgetEdit
                close={closeBudget}
                remove={removeBudget}
                folderCampaigns={folderCampaigns}
                removeCampaign={removeCampaign}
                addCampaigns={addCampaigns}
                key={budget.id}
                showFolderCampaigns={showFolderCampaigns}
                max={remainingValue + budget.value}
                budget={budget}
                change={changeBudgetField}/>
            ) : (
              <EmptySelectionCard
                available={remainingAmount}
                amount={order.amount}
                createBudget={createBudget}/>)}
          </div>
        </div>
      </Page>
    </div>
  )
}

OrderEdit.displayName = 'Order-Edit'
OrderEdit.propTypes = {
  showFolderCampaigns: React.PropTypes.bool,
  runAutoBudget: React.PropTypes.func,
  save: React.PropTypes.func,
  createBudget: React.PropTypes.func,
  removeBudget: React.PropTypes.func,
  removeCampaign: React.PropTypes.func,
  remainingAmount: React.PropTypes.number,
  remainingValue: React.PropTypes.number,
  addCampaigns: React.PropTypes.func,
  selectBudget: React.PropTypes.func,
  changeOrderField: React.PropTypes.func,
  changeBudgetField: React.PropTypes.func,
  budget: budgetType,
  order: orderType,
  folderCampaigns: React.PropTypes.arrayOf(campaignType)
}

export default OrderEdit
