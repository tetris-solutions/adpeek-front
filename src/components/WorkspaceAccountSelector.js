import React from 'react'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {loadCompanyAccountsAction} from '../actions/load-company-accounts'
import Autosuggest from 'react-autosuggest'
import get from 'lodash/fp/get'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

const {PropTypes} = React
const getSuggestionValue = get('external_name')

const theme = {
  container: 'WAS__container',
  containerOpen: 'WAS__container--open',
  input: 'WAS__input',
  suggestionsContainer: 'WAS__suggestions-container',
  suggestion: 'WAS__suggestion',
  suggestionFocused: 'WAS__suggestion--focused',
  sectionContainer: 'WAS__section-container',
  sectionTitle: 'WAS__section-title',
  sectionSuggestionsContainer: 'WAS__section-suggestions-container'
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
    })
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
    const matchingName = ({external_name}) => includes(external_name, value)
    this.setState({
      suggestions: filter(this.context.company.accounts, matchingName)
    })
  },
  onSuggestionSelected (event, {suggestion}) {
    this.setState({account: suggestion || null})
  },
  render () {
    const {isLoading, suggestions, value, account} = this.state

    const inputProps = {
      value,
      placeholder: isLoading ? 'Loading...' : 'Type account name',
      onChange: this.onChange
    }

    return (
      <div>
        <input type='hidden' name={`${this.props.platform}_account`} value={JSON.stringify(account)}/>
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
