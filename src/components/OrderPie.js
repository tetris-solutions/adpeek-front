import React from 'react'
import orderType from '../propTypes/order'
import Highcharts from './Highcharts'
import map from 'lodash/map'
import csjs from 'csjs'
import isNumber from 'lodash/isNumber'

const {PropTypes} = React
const style = csjs`
.orderPieChart {
  height: 30vh
}`

export const OrderPie = React.createClass({
  displayName: 'Order-Pie',
  propTypes: {
    order: orderType,
    selectBudget: PropTypes.func
  },
  onBudgetClick ({point}) {
    this.props.selectBudget(point.index)
  },
  render () {
    const {order: {name, amount, budgets}} = this.props

    function calculateAmount (budget) {
      return isNumber(budget.amount)
        ? budget.amount
        : (budget.percentage / 100) * amount
    }

    return (
      <Highcharts className={String(style.orderPieChart)}>
        <credits enabled={false}/>

        <chart
          plotBackgroundColor={null}
          plotBorderWidth={null}
          plotShadow={false}
          type='pie'/>

        <title>{name}</title>

        <tooltip pointFormat='{series.name}: <b>R$ {point.y:.2f}</b>'/>

        <plot-options>
          <pie showInLegend allowPointSelect onClick={this.onBudgetClick}>
            <cursor>pointer</cursor>
            <data-labels enabled={false}/>
          </pie>
        </plot-options>

        <pie colorByPoint>
          <name>Budget</name>

          {map(budgets, (budget, index) => (
            <point key={index} y={calculateAmount(budget)} index={index}>
              {budget.name}
            </point>
          ))}
        </pie>
      </Highcharts>
    )
  }
})

export default OrderPie
