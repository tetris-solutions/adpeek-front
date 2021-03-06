import isNumber from 'lodash/isNumber'
import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {prettyNumber} from '../../../functions/pretty-number'
import style from './style'

const num = val => !isNumber(val) ? 0 : val
const division = (a, b) => b === 0 ? 0 : a / b

const colors = {
  neutral: {
    icon: 'sentiment_neutral',
    color: 'mdl-color-text--grey-900'
  },
  bad: {
    icon: 'sentiment_very_dissatisfied',
    color: 'mdl-color-text--red-900'
  },
  good: {
    icon: 'mood',
    color: 'mdl-color-text--green-900'
  }
}

function goal (percent) {
  if (percent < 70 || percent > 110) {
    return colors.bad
  }

  if (percent >= 95) {
    return colors.good
  }

  return colors.neutral
}

const Daily = ({budget, cost, locales}) => {
  let icon, color, label

  if (!isNumber(budget) || !isNumber(cost)) {
    icon = colors.neutral.icon
    color = colors.neutral.color
    label = '--'
  } else {
    const ratio = division(num(cost), num(budget))
    const c = goal(ratio * 100)

    icon = c.icon
    color = c.color
    label = prettyNumber(ratio, 'percentage', locales)
  }

  const currency = n => isNumber(n)
    ? prettyNumber(n, 'currency', locales)
    : 'R$ --'

  return (
    <div>
      <div className={style.label}>
        <Message>investmentDayLabel</Message>:
      </div>

      <div className={`${style.stats} ${color}`} title={`${currency(cost)} / ${currency(budget)}`}>
        <i className='material-icons'>{icon}</i>
        <span className={style.iconLabel}>{label}</span>
      </div>
    </div>
  )
}

Daily.displayName = 'Daily'

const Period = ({cost, budget, locales}) => (
  <div>
    <div className={style.label}>
      <Message>investmentLabel</Message>:
    </div>

    <div className={style.stats}>
      <div className={style.numbers}>
        <strong>
          {!isNumber(cost) ? '--' : prettyNumber(cost, 'currency', locales)}
        </strong>
        <span className='mdl-color-text--grey-600'>
          {' / '}
          {!isNumber(budget) ? '--' : prettyNumber(budget, 'currency', locales)}
        </span>
      </div>
      <div className={`mdl-color--grey-300 ${style.rail}`}>
        <div
          style={{width: Math.min(100, Math.floor(100 * division(num(cost), num(budget)))) + '%'}}
          className={num(cost) > num(budget)
            ? 'mdl-color--red-800'
            : 'mdl-color--primary'}/>
      </div>
    </div>
  </div>
)

Period.displayName = 'Period'
Period.propTypes = Daily.propTypes = {
  locales: PropTypes.string,
  budget: PropTypes.number,
  cost: PropTypes.number
}

const EmptyStats = ({lastOrder}, {moment}) => (
  <div className={`${style.statsWrap} ${style.empty} mdl-color-text--grey-600`}>
    <br/>
    {lastOrder
      ? (
        <h6>
          <Message>lastActiveOrder</Message>:
          <br/>
          <small>{moment(lastOrder.end).fromNow()}</small>
        </h6>
      ) : (
        <h6>
          <Message>noActiveOrder</Message>
        </h6>
      )}
  </div>
)

EmptyStats.displayName = 'Empty-Stats'
EmptyStats.propTypes = {
  lastOrder: PropTypes.object
}
EmptyStats.contextTypes = {
  moment: PropTypes.func
}

const Stats = ({open, yesterday, orders}, {locales, location: {query}}) => orders && !orders.count
  ? <EmptyStats lastOrder={orders ? orders.last : null}/>
  : (
    <div className={style.statsWrap}>
      <Period {...open} locales={locales}/>
      <Daily {...yesterday} locales={locales}/>
    </div>
  )

Stats.displayName = 'Stats'

Stats.defaultProps = {
  open: {
    budget: null,
    cost: null
  },
  yesterday: {
    budget: null,
    cost: null
  }
}

Stats.propTypes = {
  open: PropTypes.shape({
    budget: PropTypes.number,
    cost: PropTypes.number
  }),
  yesterday: PropTypes.shape({
    budget: PropTypes.number,
    cost: PropTypes.number
  }),
  orders: PropTypes.shape({
    count: PropTypes.number,
    last: PropTypes.object
  })
}

Stats.contextTypes = {
  locales: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired
}

export default Stats
