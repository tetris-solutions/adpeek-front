import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import {contextualize} from './higher-order/contextualize'
import Input from './Input'
import moment from 'moment'
import map from 'lodash/map'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {loadAutoBudgetLogsAction} from '../actions/load-autobudget-logs'

const {PropTypes} = React
const style = csjs`
`

const yesterday = () => moment().subtract(1, 'day').format('YYYY-MM-DD')

export const OrderAutoBudget = React.createClass({
  displayName: 'OrderAutoBudget',
  mixins: [styled(style)],
  contextTypes: {
    router: PropTypes.object,
    location: PropTypes.object
  },
  propTypes: {
    dispatch: PropTypes.func,
    order: PropTypes.object,
    params: PropTypes.object
  },
  onChangeDay (e) {
    const {dispatch, params} = this.props
    const {router, location} = this.context
    const day = e.target.value

    router.push(`${location.pathname}?day=${day}`)

    dispatch(loadAutoBudgetLogsAction, day, params)
  },
  render () {
    const {location: {query}} = this.context
    const {order: {autoBudgetLogs}} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--2-offset mdl-cell--8-col'>
          <Input
            name='day'
            type='date'
            label='day'
            value={query.day || yesterday()}
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

export default contextualize(branch({}, OrderAutoBudget), 'order')
