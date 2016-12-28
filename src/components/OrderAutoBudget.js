import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import AutoBudgetLogs from './AutoBudgetLogs'
const style = csjs`
`

export const OrderAutoBudget = React.createClass({
  displayName: 'OrderAutoBudget',
  mixins: [styled(style)],
  contextTypes: {
    router: React.PropTypes.object,
    moment: React.PropTypes.func
  },
  propTypes: {
    order: React.PropTypes.object,
    folder: React.PropTypes.object,
    routeParams: React.PropTypes.object,
    params: React.PropTypes.object
  },
  onChangeDay (e) {
    const {company, workspace, folder, order} = this.props.params
    const day = e.target.value

    this.context.router.push(
      `/company/${company}/workspace/${workspace}/folder/${folder}/order/${order}/autobudget/${day}`
    )
  },
  yesterday () {
    return this.context.moment().subtract(1, 'day').format('YYYY-MM-DD')
  },
  render () {
    const {folder, order: {autoBudgetLogs}, routeParams: {day}} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--2-offset mdl-cell--8-col'>
          <Input
            name='day'
            type='date'
            label='day'
            value={day || this.yesterday()}
            onChange={this.onChangeDay}/>
          <AutoBudgetLogs logs={autoBudgetLogs} platform={folder.account.platform}/>
        </div>
      </div>
    )
  }
})

export default contextualize(OrderAutoBudget, 'order', 'folder')
