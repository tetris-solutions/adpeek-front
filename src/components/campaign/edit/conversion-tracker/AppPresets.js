import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import Radio from '../../../Radio'
import {style} from '../style'
import Well from '../../../Well'

class AppPresets extends React.Component {
  static displayName = 'App-Presets'

  static propTypes = {
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    enableFirebase: PropTypes.bool
  }

  state = {
    type: null
  }

  save = () => {
    const {type, app_platform, app_conversion_type} = this.state

    const presets = {
      ConversionTrackerType: 'AppConversion',
      app_platform,
      app_conversion_type
    }

    switch (type) {
      case 'firebase':
        // @todo double-check AppConversion presets for firebase
        presets.app_platform = 'MOBILE_APP_CHANNEL'
        presets.app_conversion_type = 'NONE'
        break
      case 'google-play':
        presets.app_platform = 'ANDROID_MARKET'
        break
    }

    switch (app_conversion_type) {
      case 'FIRST_OPEN':
      case 'DOWNLOAD':
        presets.categories = ['DOWNLOAD']
        break
      case 'IN_APP_PURCHASE':
        presets.categories = type === 'google-play'
          ? ['PURCHASE']
          : ['PURCHASE', 'SIGNUP', 'LEAD', 'PAGE_VIEW', 'DEFAULT']
        break
    }

    return this.props.save(presets)
  }

  onCheck = ({target: {value, name}}) => {
    const changes = {[name]: value}

    if (name === 'type') {
      changes.app_platform = null
      changes.app_conversion_type = null
    }

    this.setState(changes)
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
    const {type, app_platform, app_conversion_type} = this.state
    const formIsComplete = (
      type &&
      (app_platform || type !== 'app-actions') &&
      (app_conversion_type || type === 'firebase')
    )

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

          {this.props.enableFirebase && (
            <div className='mdl-cell mdl-cell--12-col'>
              <Radio {...this.radioProps('type', 'firebase')}>
                <Message>firebaseAppTitle</Message>
              </Radio>
              <p>
                <Message>firebaseAppDescription</Message>
              </p>
            </div>
          )}
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('type', 'google-play')}>
              <Message>googlePlayAppTitle</Message>
            </Radio>
            {type === 'google-play' ? (
              <Well>
                <p>
                  <Message>appConversionTypeTitle</Message>
                </p>

                <div>
                  <Radio {...this.radioProps('app_conversion_type', 'DOWNLOAD')}>
                    <Message>appDownloads</Message>
                  </Radio>
                </div>
                <div>
                  <Radio {...this.radioProps('app_conversion_type', 'IN_APP_PURCHASE')}>
                    <Message>inAppPurchases</Message>
                  </Radio>
                </div>
              </Well>
            ) : (
              <p>
                <Message>googlePlayAppDescription</Message>
              </p>
            )}
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Radio {...this.radioProps('type', 'app-actions')}>
              <Message>appActionsTitle</Message>
            </Radio>

            {type === 'app-actions' ? (
              <Well>
                <p>
                  <Message>appPlatformTitle</Message>
                </p>

                <div>
                  <Radio {...this.radioProps('app_platform', 'ANDROID_MARKET')}>
                    Android
                  </Radio>

                  {app_platform === 'ANDROID_MARKET' && (
                    <div style={{padding: '1em'}}>
                      <div>
                        <Radio {...this.radioProps('app_conversion_type', 'FIRST_OPEN')}>
                          <Message>appFirstOpen</Message>
                        </Radio>
                      </div>
                      <div>
                        <Radio {...this.radioProps('app_conversion_type', 'IN_APP_PURCHASE')}>
                          <Message>appActions</Message>
                        </Radio>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Radio {...this.radioProps('app_platform', 'ITUNES')}>
                    iOS
                  </Radio>

                  {app_platform === 'ITUNES' && (
                    <div style={{padding: '1em'}}>
                      <div>
                        <Radio {...this.radioProps('app_conversion_type', 'FIRST_OPEN')}>
                          <Message>appFirstOpen</Message>
                        </Radio>
                      </div>
                      <div>
                        <Radio {...this.radioProps('app_conversion_type', 'IN_APP_PURCHASE')}>
                          <Message>appActions</Message>
                        </Radio>
                      </div>
                    </div>
                  )}
                </div>
              </Well>
            ) : (
              <p>
                <Message>appActionsDescription</Message>
              </p>
            )}
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

export default AppPresets
