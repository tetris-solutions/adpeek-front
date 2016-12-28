import React from 'react'
import Select from './Select'
import {branch} from 'baobab-react/higher-order'
import {changeLocaleAction} from 'tetris-iso/actions'

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
  dispatch: React.PropTypes.func,
  locale: React.PropTypes.string,
  userLocale: React.PropTypes.string
}

LocaleSelector.displayName = 'Locale-Selector'

export default branch({
  userLocale: ['user', 'locale'],
  locale: ['locale']
}, LocaleSelector)
