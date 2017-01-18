import csjs from 'csjs'
import isNumber from 'lodash/isNumber'
import map from 'lodash/map'
import round from 'lodash/round'
import size from 'lodash/size'
import React from 'react'

import orderType from '../propTypes/order'
import Highcharts from './Highcharts'
import {styled} from './mixins/styled'
const style = csjs`
.orderPieChart {
  height: 70vh
}`

export const OrderPie = React.createClass({
  displayName: 'Order-Pie',
  mixins: [styled(style)],
  propTypes: {
    selectedBudgetId: React.PropTypes.string,
    remainingAmount: React.PropTypes.number,
    order: orderType,
    selectBudget: React.PropTypes.func
  },
  contextTypes: {
    messages: React.PropTypes.object
  },
  selectPoint (index, id) {
    this.props.selectBudget(id === 'remaining' ? null : index)
  },
  onBudgetClick ({point: {options: {index, id}}}) {
    this.selectPoint(index, id)
  },
  onLegendClick (e) {
    e.preventDefault()
    this.selectPoint(e.target.options.index, e.target.options.id)
  },
  render () {
    const {messages: {availableBudget, budgetLabel}} = this.context
    const {selectedBudgetId, remainingAmount, order: {name, amount, budgets}} = this.props

    function calculateAmount (b) {
      return isNumber(b.amount)
        ? b.amount
        : round((b.percentage / 100) * amount, 2)
    }

    return (
      <Highcharts ref='chart' className={String(style.orderPieChart)}>
        <credits enabled={false}/>

        <chart
          plotBackgroundColor={null}
          plotBorderWidth={null}
          plotShadow={false}
          type='pie'/>

        <title>{name}</title>

        <tooltip>
          <point-format>{
            '{series.name}: <b>R$ {point.y:.2f}</b><i> {point.percentage:.1f}%</i><br/>{point.options.campaigns}'
          }</point-format>
        </tooltip>

        <plot-options>
          <pie showInLegend allowPointSelect onClick={this.onBudgetClick}>
            <cursor>pointer</cursor>
            <data-labels enabled={false}/>
            <point>
              <events legendItemClick={this.onLegendClick}/>
            </point>
          </pie>
        </plot-options>

        <pie id='budgets' colorByPoint>
          <name>{budgetLabel}</name>

          {map(budgets, (budget, index) => (
            <point
              key={index}
              id={budget.id}
              sliced={selectedBudgetId === budget.id}
              campaigns={map(budget.campaigns, ({name}) => `- ${name}`).join('<br/>')}
              y={calculateAmount(budget)}
              index={index}>
              {budget.name}
            </point>
          ))}

          <point
            color='#c1c1c1'
            id='remaining'
            y={remainingAmount}
            index={size(budgets)}>
            {availableBudget}
          </point>
        </pie>
      </Highcharts>
    )
  }
})

export default OrderPie

