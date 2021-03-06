import React from 'react'
import PropTypes from 'prop-types'
import Select from './Select'
import {branch} from './higher-order/branch'
import {changeLocaleAction} from '@tetris/front-server/actions'

const makeChangeEventHandler = dispatch => function onChange ({target: {value}}) {
  dispatch(changeLocaleAction, value)
}

export function LocaleSelector ({dispatch, locale, userLocale}) {
  return (
    <Select name='locale' value={locale || userLocale} onChange={makeChangeEventHandler(dispatch)}>
      <option value='en'>English</option>
      <option value='pt-BR'>Português</option>
    </Select>
  )
}

LocaleSelector.propTypes = {
  dispatch: PropTypes.func,
  locale: PropTypes.string,
  userLocale: PropTypes.string
}

LocaleSelector.displayName = 'Locale-Selector'

export default branch({
  userLocale: ['user', 'locale'],
  locale: ['locale']
}, LocaleSelector)
