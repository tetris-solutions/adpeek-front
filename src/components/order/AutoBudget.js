import React from 'react'
import PropTypes from 'prop-types'
import {routeParamsBasedBranch} from '../higher-order/branch'
import Input from '../Input'
import AutoBudgetLogs from './AutoBudgetLogs'

class OrderAutoBudget extends React.Component {
  static displayName = 'OrderAutoBudget'

  static contextTypes = {
    router: PropTypes.object,
    moment: PropTypes.func
  }

  static propTypes = {
    order: PropTypes.object,
    folder: PropTypes.object,
    routeParams: PropTypes.object,
    params: PropTypes.object
  }

  onChangeDay = (e) => {
    const {company, workspace, folder, order} = this.props.params
    const day = e.target.value

    this.context.router.push(
      `/c/${company}/w/${workspace}/f/${folder}/o/${order}/autobudget/${day}`
    )
  }

  yesterday = () => {
    return this.context.moment().subtract(1, 'day').format('YYYY-MM-DD')
  }

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
}

export default routeParamsBasedBranch('folder', 'order', OrderAutoBudget)
