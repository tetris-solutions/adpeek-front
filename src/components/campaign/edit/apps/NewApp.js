import React from 'react'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import {createAppExtensionAction} from '../../../../actions/create-app'
import {Tab, Tabs} from '../../../Tabs'
import RequiredFields from './RequiredFields'
import Tracking from '../shared/Tracking'
import Period from '../shared/Period'
import NewFeedItem from '../shared/NewFeedItem'
import Scheduling from '../shared/Scheduling'

class NewApp extends NewFeedItem {
  static displayName = 'New-App'

  save = () => {
    const {dispatch, feedId, onSubmit, params} = this.props

    return dispatch(createAppExtensionAction, params, feedId, this.state)
      .then(onSubmit)
  }

  state = {
    appId: '',
    appStore: 'GOOGLE_PLAY',
    appLinkText: '',
    appFinalUrl: '',
    appFinalMobileUrl: '',
    appTrackingUrlTemplate: '',
    devicePreference: null,
    startTime: null,
    endTime: null,
    scheduling: [],
    urlCustomParameters: [
      {key: '', value: ''},
      {key: '', value: ''},
      {key: '', value: ''}
    ]
  }

  onToggleDevice = ({target: {checked, value}}) => {
    this.setState({
      devicePreference: checked
        ? Number(value)
        : null,

      appFinalMobileUrl: checked
        ? ''
        : this.state.appFinalMobileUrl
    })
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <Tabs>
          <Tab id='app-required-fields' title={<Message>appTitle</Message>}>
            <RequiredFields
              {...this.state}
              onChange={this.onChangeText}
              onToggleDevice={this.onToggleDevice}/>
          </Tab>
          <Tab id='app-tracking' title={<Message>trackingUrlTitle</Message>}>
            <Tracking
              {...this.state}
              prefix='app'
              onChange={this.onChangeText}/>
          </Tab>
          <Tab id='app-period' title={<Message>feedItemPeriodTitle</Message>}>
            <Period
              {...this.state}
              onChangeRange={this.onChangeRange}/>
          </Tab>
          <Tab id='app-scheduling' title={<Message>feedItemSchedulingTitle</Message>}>
            <Scheduling
              onChange={this.onChangeText}
              removeSchedule={this.removeSchedule}
              addSchedule={this.addSchedule}
              schedules={this.state.scheduling}/>
          </Tab>
        </Tabs>

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

export default styledComponent(NewApp, style)
