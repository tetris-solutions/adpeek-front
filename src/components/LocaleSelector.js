import React from 'react'
import Select from './Select'
import {branch} from 'baobab-react/higher-order'
import {changeLocaleAction} from 'tetris-iso/actions'

const {PropTypes} = React

function onChange (dispatch) {
  return ({target: {value}}) => {
    dispatch(changeLocaleAction, value)
  }
}

export function LocaleSelector ({dispatch, locale, userLocale}) {
  return (
    <Select name='locale' value={locale || userLocale} onChange={onChange(dispatch)}>
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
