import noop from 'lodash/noop'
import debounce from 'lodash/debounce'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import property from 'lodash/property'
import upperFirst from 'lodash/upperFirst'
import Autosuggest from 'react-autosuggest'
import Message from 'intl-messageformat'
import React from 'react'
import PropTypes from 'prop-types'
import {removeFromStart} from '../../functions/remove-from-start'
import {loadCompanyAccountsAction} from '../../actions/load-company-accounts'
import {node} from '../higher-order/branch'
import {styledComponent} from '../higher-order/styled'
import {
  style,
  theme,
  Suggestion,
  preventSubmit,
  cleanStr,
  yes
} from '../AutoSelect'

const getSuggestionValue = property('name')

/**
 * filters matching accounts
 * @param {String} platform platform name
 * @param {String} value input value
 * @returns {filterCallback} function to be used on .filter
 */
function filterAccounts (platform, value) {
  value = cleanStr(value)

  /**
   * actually compares account
   * @param {Object} account account object
   * @returns {boolean} is matching account
   */
  function filterCallback (account) {
    return account.platform === platform && (
      includes(cleanStr(account.name), value) ||
      includes(cleanStr(account.external_id), value)
    )
  }

  return filterCallback
}

/**
 * filters suggestions
 * @param {Array} accounts list of loose accounts
 * @param {String} platform current platform
 * @param {String} value input value
 * @returns {Array} filtered list
 */
function getSuggestions (accounts, platform, value) {
  const matchingName = filterAccounts(platform, value)
  return filter(accounts, matchingName)
}

class WorkspaceAccountSelector extends React.Component {
  static displayName = 'Workspace-Account-Selector'

  static contextTypes = {
    locales: PropTypes.string,
    messages: PropTypes.object
  }

  static propTypes = {
    disabled: PropTypes.bool,
    company: PropTypes.shape({
      id: PropTypes.string,
      accounts: PropTypes.array
    }),
    onLoad: PropTypes.func,
    platform: PropTypes.string,
    dispatch: PropTypes.func,
    value: PropTypes.string,
    account: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    account: null,
    value: '',
    onChange: noop,
    onLoad: noop
  }

  componentWillMount () {
    this.setState({
      suggestions: getSuggestions(
        this.props.company.accounts,
        this.props.platform,
        this.state.account
          ? this.state.account.external_id
          : this.removeValuePrefix(this.state.value)
      )
    })
  }

  updateSuggestionList = () => {
    if (this.hasUnmounted) return

    this.setState({isLoading: false},
      () => this.onSuggestionsFetchRequested(this.state))
  }

  componentDidMount () {
    const {company, platform, dispatch, onLoad} = this.props

    this.onSuggestionsFetchRequested = debounce(this.onSuggestionsFetchRequested, 300)

    dispatch(loadCompanyAccountsAction, company.id, platform)
      .then(this.updateSuggestionList)
      .then(onLoad)
  }

  componentWillUnmount () {
    this.hasUnmounted = true
  }

  platformPrefix = () => {
    return `${upperFirst(this.props.platform)} :: `
  }

  addValuePrefix = (value) => {
    return value ? `${this.platformPrefix()}${this.removeValuePrefix(value)}` : value
  }

  removeValuePrefix = (value) => {
    return removeFromStart(value, this.platformPrefix())
  }

  onChange = (e, {newValue}) => {
    const newState = {value: this.addValuePrefix(newValue)}
    if (!newState.value) newState.account = null
    this.setState(newState)
  }

  onSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: getSuggestions(
        this.props.company.accounts,
        this.props.platform,
        this.removeValuePrefix(value)
      )
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  onSuggestionSelected = (event, {suggestion}) => {
    this.setState({account: suggestion || null},
      () => this.props.onChange(this.state.account))
  }

  state = {
    account: this.props.account,
    value: this.addValuePrefix(this.props.value),
    isLoading: true
  }

  render () {
    const {locales, messages: {accountSelectorPlaceholder}} = this.context
    const {isLoading, suggestions, value, account} = this.state
    const {platform, disabled} = this.props
    const inputProps = {
      value,
      placeholder: isLoading
        ? 'Loading...'
        : new Message(accountSelectorPlaceholder, locales).format({platform: upperFirst(platform)}),
      onChange: this.onChange,
      onKeyDown: preventSubmit,
      disabled: isLoading || disabled
    }

    return (
      <div>
        <input type='hidden' name={`${platform}_account`} value={JSON.stringify(account)}/>
        <Autosuggest
          theme={theme}
          suggestions={suggestions}
          shouldRenderSuggestions={yes}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={Suggestion}
          inputProps={inputProps}/>
      </div>
    )
  }
}

export default node('user', 'company',
  styledComponent(WorkspaceAccountSelector, style))
