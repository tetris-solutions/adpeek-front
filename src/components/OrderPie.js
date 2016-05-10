import React from 'react'
import orderType from '../propTypes/order'
import Highcharts from './Highcharts'
import map from 'lodash/map'
import csjs from 'csjs'
import isNumber from 'lodash/isNumber'
import size from 'lodash/size'
import {styled} from './mixins/styled'

const {PropTypes} = React
const style = csjs`
.orderPieChart {
  height: 70vh
}`

export const OrderPie = React.createClass({
  displayName: 'Order-Pie',
  mixins: [styled(style)],
  propTypes: {
    remainingAmount: PropTypes.number,
    order: orderType,
    selectBudget: PropTypes.func
  },
  onBudgetClick ({point: {options: {index, id}}}) {
    this.props.selectBudget(id === 'remaining' ? null : index)
  },
  render () {
    const {remainingAmount, order: {name, amount, budgets}} = this.props

    function calculateAmount (b) {
      return isNumber(b.amount)
        ? b.amount
        : (b.percentage / 100) * amount
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

        <pie id='budgets' colorByPoint>
          <name>Budget</name>

          {map(budgets, (budget, index) => (
            <point key={index} id={budget.id} y={calculateAmount(budget)} index={index}>
              {budget.name}
            </point>
          ))}

          <point color='#c1c1c1' id='remaining' y={remainingAmount} index={size(budgets)}>
            Restante
          </point>
        </pie>
      </Highcharts>
    )
  }
})

export default OrderPie
