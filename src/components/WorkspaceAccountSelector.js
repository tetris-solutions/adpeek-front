import csjs from 'csjs'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import property from 'lodash/property'
import upperFirst from 'lodash/upperFirst'
import Autosuggest from 'react-autosuggest'
import Message from 'intl-messageformat'
import React from 'react'
import trimStart from 'lodash/trimStart'

import {loadCompanyAccountsAction} from '../actions/load-company-accounts'
import {contextualize} from './higher-order/contextualize'
import {styled} from './mixins/styled'

const yes = () => true
const {PropTypes} = React
const getSuggestionValue = property('name')

/**
 * prevent formSubmit
 * @param {KeyboardEvent} e keydown event
 * @returns {undefined}
 */
function preventSubmit (e) {
  if (e.keyCode === 13) e.preventDefault()
}

const cleanStr = str => deburr(lowerCase(str))

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

const style = csjs`
.container {
  position: relative;
  margin: 1em 0;
}

.input {
  width: 100%;
  text-indent: .5em;
  font-size: medium;
  font-weight: 300;
  line-height: 2.5em;
  border: none;
  border-bottom: 1px solid rgba(0,0,0,.12);
}

.input[disabled] {
  background: rgba(250, 250, 250, 0.6) !important;
}
.input:focus {
  outline: none;
}

.containerOpen > .input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.suggestionsContainer {
  position: absolute;
  top: 2.5em;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
  border: 1px solid rgb(220, 220, 220);
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  font-weight: 300;
  font-size: medium;
  z-index: 2;
}
.suggestionsContainer:empty {
  visibility: hidden;
}

.suggestionsList {
  margin: 0;
  padding: 0;
}

.suggestion {
  cursor: pointer;
  line-height: 3em;
  text-indent: 1em;
}

.suggestionLine {
  display: block;
  width: 94%;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestionFocused {
  background-color: #ddd;
}
.sectionContainer {}
.sectionTitle {}
.sectionSuggestionsContainer {}`

const theme = {}

// assemble `theme` object, required by ReactAutosuggest

function setThemeClassName (className) {
  theme[className] = String(style[className])
}

Object.keys(style).forEach(setThemeClassName)

function Suggestion ({name}) {
  return (
    <span className={style.suggestionLine}>
      {name}
    </span>
  )
}

Suggestion.displayName = 'Suggestion'
Suggestion.propTypes = {
  name: PropTypes.string
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

export const WorkspaceAccountSelector = React.createClass({
  displayName: 'Workspace-Account-Selector',
  mixins: [styled(style)],
  contextTypes: {
    locales: PropTypes.string,
    messages: PropTypes.object
  },
  propTypes: {
    disabled: PropTypes.bool,
    company: PropTypes.shape({
      id: PropTypes.string,
      accounts: PropTypes.array
    }),
    platform: PropTypes.string,
    dispatch: PropTypes.func,
    value: PropTypes.string,
    account: PropTypes.object
  },
  getDefaultProps () {
    return {
      account: null,
      value: ''
    }
  },
  getInitialState () {
    return {
      account: this.props.account,
      value: this.addValuePrefix(this.props.value),
      isLoading: true
    }
  },
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
  },
  updateSuggestionList () {
    if (this.hasUnmounted) return
    const updateSuggestions = () => this.onSuggestionsFetchRequested(this.state)
    this.setState({isLoading: false}, updateSuggestions)
  },
  componentDidMount () {
    this.onSuggestionsFetchRequested = debounce(this.onSuggestionsFetchRequested, 300)
    this.props.dispatch(loadCompanyAccountsAction, this.props.company.id, this.props.platform)
      .then(this.updateSuggestionList)
  },
  componentWillUnmount () {
    this.hasUnmounted = true
  },
  platformPrefix () {
    return `${upperFirst(this.props.platform)} :: `
  },
  addValuePrefix (value) {
    return value ? `${this.platformPrefix()}${this.removeValuePrefix(value)}` : value
  },
  removeValuePrefix (value) {
    return trimStart(value, this.platformPrefix())
  },
  onChange (e, {newValue}) {
    const newState = {value: this.addValuePrefix(newValue)}
    if (!newState.value) newState.account = null
    this.setState(newState)
  },
  onSuggestionsFetchRequested ({value}) {
    this.setState({
      suggestions: getSuggestions(
        this.props.company.accounts,
        this.props.platform,
        this.removeValuePrefix(value)
      )
    })
  },
  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  },
  onSuggestionSelected (event, {suggestion}) {
    this.setState({account: suggestion || null})
  },
  render () {
    const {locales, messages: {accountSelectorPlaceholder}} = this.context
    const {isLoading, suggestions, value, account} = this.state
    const {platform, disabled, account: savedAccount} = this.props
    const inputProps = {
      value,
      placeholder: isLoading
        ? 'Loading...'
        : new Message(accountSelectorPlaceholder, locales).format({platform: upperFirst(platform)}),
      onChange: this.onChange,
      onKeyDown: preventSubmit,
      disabled: isLoading || (disabled && savedAccount)
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
})

export default contextualize(WorkspaceAccountSelector, 'company')
