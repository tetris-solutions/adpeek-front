import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import OrderSelector from './OrdersSelector'
import campaignType from '../propTypes/campaign'
import orderType from '../propTypes/campaign'
import budgetType from '../propTypes/campaign'
import OrderHeader from './OrderHeader'
import BudgetEdit from './BudgetEdit'
import OrderPie from './OrderPie'
import EmptySelectionCard from './BudgetEmptySelection'

const {PropTypes} = React

export function OrderEdit ({
  save,
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
      <header className='mdl-layout__header'>
        <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
          <span>
            <OrderSelector/>
          </span>
          <div className='mdl-layout-spacer'/>
          <button onClick={save} className='mdl-button mdl-color-text--grey-100'>
            <Message>saveCallToAction</Message>
          </button>
        </div>
      </header>

      <section>

        <OrderHeader
          change={changeOrderField}
          order={order}/>

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--5-col'>
            <br/>

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
                createBudget={createBudget}/>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

OrderEdit.displayName = 'Order-Edit'
OrderEdit.propTypes = {
  showFolderCampaigns: PropTypes.bool,
  save: PropTypes.func,
  createBudget: PropTypes.func,
  removeBudget: PropTypes.func,
  removeCampaign: PropTypes.func,
  remainingAmount: PropTypes.number,
  remainingValue: PropTypes.number,
  addCampaigns: PropTypes.func,
  selectBudget: PropTypes.func,
  changeOrderField: PropTypes.func,
  changeBudgetField: PropTypes.func,
  budget: orderType,
  order: budgetType,
  folderCampaigns: PropTypes.arrayOf(campaignType)
}

export default OrderEdit
