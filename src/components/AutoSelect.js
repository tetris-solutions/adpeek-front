import csjs from 'csjs'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import property from 'lodash/property'
import Autosuggest from 'react-autosuggest'
import React from 'react'
import PropTypes from 'prop-types'
import {removeFromStart} from '../functions/remove-from-start'
import {styledComponent} from './higher-order/styled'
import get from 'lodash/get'

export const yes = () => true

const getSuggestionValue = property('text')

export function preventSubmit (e) {
  if (e.keyCode === 13) e.preventDefault()
}

export const cleanStr = str => deburr(lowerCase(str))

export const style = csjs`
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
  cursor: not-allowed;
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
  width: 100%;
  border: 1px solid rgb(220, 220, 220);
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  z-index: 2;
}

.suggestionsContainer:empty {
  display: none;
}

.suggestionsList {
  list-style: none;
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

.suggestionHighlighted {
  background-color: #ddd;
}`

export const theme = {}

// assemble `theme` object, required by Autosuggest

function setThemeClassName (className) {
  theme[className] = String(style[className])
}

Object.keys(style).forEach(setThemeClassName)

export function Suggestion ({text, name}) {
  return (
    <span className={style.suggestionLine}>
      {text || name}
    </span>
  )
}

Suggestion.displayName = 'Suggestion'
Suggestion.propTypes = {
  name: PropTypes.string,
  text: PropTypes.string
}

class AutoSelect extends React.Component {
  static displayName = 'Auto-Select'

  static propTypes = {
    disabled: PropTypes.bool,
    prefix: PropTypes.string,
    onChange: PropTypes.func,
    selected: PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.string
    }),
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      text: PropTypes.string
    })).isRequired
  }

  static defaultProps = {
    selected: null,
    prefix: '',
    placeholder: ''
  }

  componentWillMount () {
    this.calculateSuggestions(this.state)
  }

  componentWillUnmount () {
    this.hasUnmounted = true
  }

  componentWillReceiveProps ({selected}) {
    if (get(selected, 'text') !== get(this.props, 'selected.text')) {
      this.setState({
        selected,
        value: this.addValuePrefix(get(selected, 'text', ''))
      })
    }
  }

  addValuePrefix = (value) => {
    return value ? `${this.props.prefix}${this.removeValuePrefix(value)}` : ''
  }

  removeValuePrefix = (value) => {
    return removeFromStart(value, this.props.prefix)
  }

  onChange = (e, {newValue}) => {
    const newState = {
      value: this.addValuePrefix(newValue)
    }

    if (!newState.value) {
      newState.selected = null

      if (this.props.onChange) {
        this.props.onChange(null)
      }
    }

    this.setState(newState)
  }

  getSuggestions = (value) => {
    value = cleanStr(value)

    return filter(this.props.options, option => (
      includes(cleanStr(option.text), value) ||
      includes(cleanStr(option.value), value)
    ))
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  onSuggestionSelected = (event, {suggestion}) => {
    const selected = suggestion || null

    this.setState({selected})

    if (this.props.onChange) {
      this.props.onChange(selected)
    }
  }

  calculateSuggestions = ({value}) => {
    this.setState({
      suggestions: this.getSuggestions(this.removeValuePrefix(value))
    })
  }

  onSuggestionsFetchRequested = debounce(this.calculateSuggestions, 300)

  state = {
    selected: this.props.selected,
    value: this.addValuePrefix(get(this.props, 'selected.text', ''))
  }

  render () {
    const {suggestions, value} = this.state
    const {placeholder, disabled} = this.props
    const inputProps = {
      value,
      placeholder,
      disabled,
      onChange: this.onChange,
      onKeyDown: preventSubmit
    }

    return (
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
    )
  }
}

export default styledComponent(AutoSelect, style)
