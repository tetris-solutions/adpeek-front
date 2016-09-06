import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'

import budgetType from '../propTypes/budget'
import campaignType from '../propTypes/campaign'
import orderType from '../propTypes/order'
import BudgetEdit from './BudgetEdit'
import EmptySelectionCard from './BudgetEmptySelection'
import OrderHeader from './OrderHeader'
import OrderPie from './OrderPie'
import OrderSelector from './OrdersSelector'

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
}, {params}) {
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
          {params.order && (
            <Link
              className='mdl-button mdl-color-text--grey-100'
              to={`/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/orders/clone?order=${params.order}`}>
              <Message>cloneSingleOrder</Message>
            </Link>)}
          <button onClick={save} className='mdl-button mdl-color-text--grey-100'>
            <Message>save</Message>
          </button>
        </div>
      </header>

      <section>
        <OrderHeader
          min={Math.max(1, order.amount - remainingValue)}
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
  budget: budgetType,
  order: orderType,
  folderCampaigns: PropTypes.arrayOf(campaignType)
}
OrderEdit.contextTypes = {
  params: PropTypes.object
}

export default OrderEdit
