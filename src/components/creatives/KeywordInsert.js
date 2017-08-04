import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../Form'
import Select from '../Select'
import {Button, Submit} from '../Button'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'
import {formatKeyword, parseKeyword} from '../../functions/keyword-utils'

const style = csjs`
.actions > button:last-child {
  float: right;
}
.text {
  width: 100%;
}
.text > textarea {
  min-height: 8em;
  resize: vertical;
}`

class KeywordInsert extends React.Component {
  static displayName = 'Keyword-Insert'
  static propTypes = {
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
  }
  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    matchType: 'BROAD',
    text: ''
  }

  save = (e) => {
    this.props.save(
      this.state.text
        .split('\n')
        .map(t => parseKeyword(t, true))
    )
  }

  onChangeText = ({target: {value: text}}) => {
    this.setState({text})
  }

  onChangeMatchType = ({target: {value: matchType}}) => {
    this.setState({
      matchType,
      text: this.state.text
        .split('\n')
        .map(text => formatKeyword(text, matchType))
        .join('\n')
    })
  }

  render () {
    const {messages} = this.context

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select name='match_type' onChange={this.onChangeMatchType} label='matchType' value={this.state.matchType}>
              <option value='BROAD'>{messages.matchBroad}</option>
              <option value='EXACT'>{messages.matchExact}</option>
              <option value='PHRASE'>{messages.matchPhrase}</option>
            </Select>
          </div>

          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-textfield ${style.text}`}>
              <textarea
                required
                onChange={this.onChangeText}
                value={this.state.text}
                placeholder={this.context.messages.newCommentPlaceholder}
                className='mdl-textfield__input'
                name='keywords'/>
            </div>
          </div>
        </div>

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--accent' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(KeywordInsert, style)
