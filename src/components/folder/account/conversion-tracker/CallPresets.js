import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import Radio from '../../../Radio'
import {style} from '../../../campaign/edit/style'

class CallPresets extends React.Component {
  static displayName = 'Call-Presets'

  static propTypes = {
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  }

  state = {
    ConversionTrackerType: null
  }

  save = () => {
    const {ConversionTrackerType} = this.state
    const presets = {
      ConversionTrackerType,
      categories: ['LEAD', 'DEFAULT', 'PURCHASE', 'SIGNUP'],
      ctc_lookback_window: 30,
      viewthrough_lookback_window: 1,
      counting_type: 'ONE_PER_CLICK',
      attribution_model_type: 'LAST_CLICK'
    }

    switch (ConversionTrackerType) {
      case 'AdCallMetricsConversion':
      case 'WebsiteCallMetricsConversion':
        presets.website_phone_call_duration = 60
    }

    return this.props.save(presets)
  }

  onCheck = ({target: {value, name}}) => {
    this.setState({[name]: value})
  }

  radioProps = (name, value) => {
    return {
      id: `radio-${name}-${value}`,
      required: true,
      checked: this.state[name] === value,
      onChange: this.onCheck,
      name,
      value
    }
  }

  render () {
    const formIsComplete = Boolean(this.state.ConversionTrackerType)

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>
              <div>
                <Message>callConversionsTitle</Message>
              </div>
              <small>
                <Message>callConversionsSubTitle</Message>
              </small>
            </h5>
          </div>

          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('ConversionTrackerType', 'AdCallMetricsConversion')}>
              <Message>adCallMetricsConversionTitle</Message>
            </Radio>
            <p style={{marginTop: '3.5em'}}>
              <Message html>adCallMetricsConversionDescription</Message>
            </p>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('ConversionTrackerType', 'WebsiteCallMetricsConversion')}>
              <Message>websiteCallMetricsConversionTitle</Message>
            </Radio>
            <p style={{marginTop: '2.5em'}}>
              <Message html>websiteCallMetricsConversionDescription</Message>
            </p>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('ConversionTrackerType', 'AdWordsConversionTracker')}>
              <Message>adwordsConversionCallTitle</Message>
            </Radio>
            <p style={{marginTop: '2.5em'}}>
              <Message html>adwordsConversionCallDescription</Message>
            </p>
          </div>
        </div>

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored' disabled={!formIsComplete}>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default CallPresets
