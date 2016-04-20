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

const {PropTypes} = React
const getSuggestionValue = get('external_name')

const cleanStr = str => deburr(lowerCase(str))

const theme = {
  container: 'WrkAccSel__container',
  containerOpen: 'WrkAccSel__container--open',
  input: 'WrkAccSel__input',
  suggestionsContainer: 'WrkAccSel__suggestions-container',
  suggestion: 'WrkAccSel__suggestion',
  suggestionFocused: 'WrkAccSel__suggestion--focused',
  sectionContainer: 'WrkAccSel__section-container',
  sectionTitle: 'WrkAccSel__section-title',
  sectionSuggestionsContainer: 'WrkAccSel__section-suggestions-container'
}

function Suggestion ({external_name}) {
  return <span>{external_name}</span>
}

Suggestion.displayName = 'Suggestion'
Suggestion.propTypes = {
  external_name: PropTypes.string
}

export const WorkspaceAccountSelector = React.createClass({
  displayName: 'Workspace-Account-Selector',
  contextTypes: {
    company: PropTypes.shape({
      id: PropTypes.string,
      accounts: PropTypes.array
    }),
    locales: PropTypes.string,
    messages: PropTypes.object
  },
  propTypes: {
    platform: PropTypes.string,
    dispatch: PropTypes.func
  },
  getInitialState () {
    return {
      account: null,
      value: '',
      suggestions: [],
      isLoading: true
    }
  },
  componentDidMount () {
    this.props.dispatch(loadCompanyAccountsAction, this.context.company.id, this.props.platform)
      .then(() => {
        const updateSuggestions = () => this.onSuggestionsUpdateRequested({value: ''})
        this.setState({isLoading: false}, updateSuggestions)
      })
  },
  onChange (e, {newValue}) {
    const newState = {value: newValue}
    if (!newState.value) newState.account = null
    this.setState(newState)
  },
  onSuggestionsUpdateRequested ({value}) {
    const matchingName = ({external_name}) => includes(cleanStr(external_name), cleanStr(value))
    this.setState({
      suggestions: filter(this.context.company.accounts, matchingName)
    })
  },
  onSuggestionSelected (event, {suggestion}) {
    this.setState({account: suggestion || null})
  },
  render () {
    const {locales, messages: {accountSelectorPlaceholder}} = this.context
    const {isLoading, suggestions, value, account} = this.state
    const {platform} = this.props
    const inputProps = {
      value,
      placeholder: isLoading
        ? 'Loading...'
        : new Message(accountSelectorPlaceholder, locales).format({platform: upperFirst(platform)}),
      onChange: this.onChange
    }

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
