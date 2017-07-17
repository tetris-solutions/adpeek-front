import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import Radio from '../../../Radio'
import {style} from '../style'

class AppPresets extends React.Component {
  static displayName = 'App-Presets'

  static propTypes = {
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  }

  state = {
    type: null
  }

  save = () => {

  }

  onCheck = ({target: {value, name}}) => {
    this.setState({[name]: value})
  }

  radioProps = (name, value) => {
    return {
      id: `radio-${name}-${value}`,
      checked: this.state[name] === value,
      onChange: this.onCheck,
      name,
      value
    }
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>
              <div>
                <Message>appConversionsTitle</Message>
              </div>
              <small>
                <Message html>
                  appConversionSubTitle
                </Message>
              </small>
            </h5>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('type', 'firebase')}>
              <Message>firebaseAppTitle</Message>
            </Radio>
            <p>
              <Message>firebaseAppDescription</Message>
            </p>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('type', 'google-play')}>
              <Message>googlePlayAppTitle</Message>
            </Radio>
            <p>
              <Message>googlePlayAppDescription</Message>
            </p>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('type', 'app-actions')}>
              <Message>appActionsTitle</Message>
            </Radio>
            <p>
              <Message>appActionsDescription</Message>
            </p>
          </div>
        </div>

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
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

export default AppPresets
