import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import moment from 'moment'
import map from 'lodash/map'

const {PropTypes} = React
const style = csjs`
`

const yesterday = () => moment().subtract(1, 'day').format('YYYY-MM-DD')

export const OrderAutoBudget = React.createClass({
  displayName: 'OrderAutoBudget',
  mixins: [styled(style)],
  contextTypes: {
    router: PropTypes.object
  },
  propTypes: {
    order: PropTypes.object,
    routeParams: PropTypes.object,
    params: PropTypes.object
  },
  onChangeDay (e) {
    const {company, workspace, folder, order} = this.props.params
    const day = e.target.value

    this.context.router.push(
      `/company/${company}/workspace/${workspace}/folder/${folder}/order/${order}/autobudget/${day}`
    )
  },
  render () {
    const {order: {autoBudgetLogs}, routeParams: {day}} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--2-offset mdl-cell--8-col'>
          <Input
            name='day'
            type='date'
            label='day'
            value={day || yesterday()}
            onChange={this.onChangeDay}/>
          <ul>
            {map(autoBudgetLogs,
              ({message}, index) => (
                <li key={index}>
                  {message}
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
})

export default contextualize(OrderAutoBudget, 'order')
