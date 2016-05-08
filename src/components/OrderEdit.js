import React from 'react'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
import OrderPie from './OrderPie'
import orderType from '../propTypes/order'
import OrderHeader from './OrderHeader'

export const OrderEdit = React.createClass({
  displayName: 'Order-Edit',
  propTypes: {
    order: orderType
  },
  getDefaultProps () {
    return {
      order: {
        name: 'Campanhas TOP',
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(1, 'month').format('YYYY-MM-DD'),
        auto_budget: true,
        amount: 1000,
        budgets: [{
          name: 'Mc Melody',
          percentage: 50,
          campaigns: []
        }, {
          name: 'Faustão',
          percentage: 30,
          campaigns: []
        }, {
          name: 'Neymar',
          percentage: 20,
          campaigns: []
        }]
      }
    }
  },
  getInitialState () {
    return {
      order: cloneDeep(this.props.order),
      selectedBudgetIndex: null
    }
  },
  selectBudget (selectedBudgetIndex) {
    this.setState({selectedBudgetIndex})
  },
  render () {
    const {order} = this.state

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <br/>
          <OrderPie order={order} selectBudget={this.selectBudget}/>
        </div>
        <div className='mdl-cell mdl-cell--7-col'>
          <OrderHeader order={order} />
        </div>
      </div>
    )
  }
})

export default OrderEdit
