import React from 'react'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {loadCompanyAccountsAction} from '../actions/load-company-accounts'
import Autosuggest from 'react-autosuggest'
import get from 'lodash/fp/get'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/lowerCase'
import deburr from 'lodash/deburr'
import upperFirst from 'lodash/upperFirst'
import Message from 'intl-messageformat'
import debounce from 'lodash/debounce'
import csjs from 'csjs'

const {PropTypes} = React
const getSuggestionValue = get('external_name')

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
        includes(cleanStr(account.external_name), value) ||
        includes(cleanStr(account.external_account), value)
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
  border: 1px solid #aaa;
  background-color: #fff;
  font-weight: 300;
  font-size: medium;
  z-index: 2;
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

Object.keys(style)
  .forEach(className => {
    theme[className] = '' + style[className]
  })

function Suggestion ({external_name}) {
  return (
    <span className={style.suggestionLine}>
      {external_name}
    </span>
  )
}

Suggestion.displayName = 'Suggestion'
Suggestion.propTypes = {
  external_name: PropTypes.string
}

/**
 * filters suggestions
 * @param {Array} accounts list of available accounts
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
  contextTypes: {
    insertCss: PropTypes.func,
    company: PropTypes.shape({
      id: PropTypes.string,
      accounts: PropTypes.array
    }),
    locales: PropTypes.string,
    messages: PropTypes.object
  },
  propTypes: {
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
      value: this.props.value,
      isLoading: true
    }
  },
  componentWillMount () {
    this.setState({
      suggestions: getSuggestions(
        this.context.company.accounts,
        this.props.platform,
        this.state.account ? this.state.account.external_account : this.state.value
      )
    })
  },
  componentDidMount () {
    this.onSuggestionsUpdateRequested = debounce(this.onSuggestionsUpdateRequested, 300)
    this.props.dispatch(loadCompanyAccountsAction, this.context.company.id, this.props.platform)
      .then(() => {
        const updateSuggestions = () => this.onSuggestionsUpdateRequested(this.state)
        this.setState({isLoading: false}, updateSuggestions)
      })
  },
  onChange (e, {newValue}) {
    const newState = {value: newValue}
    if (!newState.value) newState.account = null
    this.setState(newState)
  },
  onSuggestionsUpdateRequested ({value}) {
    this.setState({
      suggestions: getSuggestions(
        this.context.company.accounts,
        this.props.platform,
        value
      )
    })
  },
  onSuggestionSelected (event, {suggestion}) {
    this.setState({account: suggestion || null})
  },
  render () {
    const {insertCss, locales, messages: {accountSelectorPlaceholder}} = this.context
    const {isLoading, suggestions, value, account} = this.state
    const {platform} = this.props
    const inputProps = {
      value,
      placeholder: isLoading
        ? 'Loading...'
        : new Message(accountSelectorPlaceholder, locales).format({platform: upperFirst(platform)}),
      onChange: this.onChange,
      onKeyDown: preventSubmit,
      readOnly: isLoading
    }
    insertCss(style)

    return (
      <div>
        <input type='hidden' name={`${platform}_account`} value={JSON.stringify(account)}/>
        <Autosuggest
          theme={theme}
          suggestions={suggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={Suggestion}
          inputProps={inputProps}/>
      </div>
    )
  }
})

export default branch({}, WorkspaceAccountSelector)
