import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import OrderSelector from './OrdersSelector'
import HeaderSearchBox from './HeaderSearchBox'
import OrderForm from './OrderForm'
import campaignType from '../propTypes/campaign'
import orderType from '../propTypes/campaign'
import budgetType from '../propTypes/campaign'

const {PropTypes} = React

export function OrderEdit ({budgetMax, onEnter, addCampaigns, selectBudget, changeField, budget, order, campaigns}) {
  return (
    <div>
      <header className='mdl-layout__header'>
        <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
          <span>
            <OrderSelector/>
          </span>
          <div className='mdl-layout-spacer'/>
          <button className='mdl-button mdl-color-text--grey-100'>
            <Message>saveCallToAction</Message>
          </button>
          <HeaderSearchBox onEnter={onEnter}/>
        </div>
      </header>

      <OrderForm
        budgetMax={budgetMax}
        addCampaigns={addCampaigns}
        selectBudget={selectBudget}
        changeField={changeField}
        budget={budget}
        order={order}
        campaigns={campaigns}/>

    </div>
  )
}

OrderEdit.displayName = 'Order-Edit'
OrderEdit.propTypes = {
  budgetMax: PropTypes.number,
  onEnter: PropTypes.func,
  addCampaigns: PropTypes.func,
  selectBudget: PropTypes.func,
  changeField: PropTypes.func,
  budget: orderType,
  order: budgetType,
  campaigns: PropTypes.arrayOf(campaignType)
}

export default OrderEdit
