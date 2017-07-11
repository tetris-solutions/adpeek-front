import React from 'react'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import {createSiteLinkExtensionAction} from '../../../../actions/create-site-link'
import {Tab, Tabs} from '../../../Tabs'
import RequiredFields from './RequiredFields'
import Tracking from '../shared/Tracking'
import Period from '../shared/Period'
import NewFeedItem from '../shared/NewFeedItem'
import Scheduling from '../shared/Scheduling'

class NewSiteLink extends NewFeedItem {
  static displayName = 'New-Site-Link'

  save = () => {
    const {dispatch, feedId, onSubmit, params} = this.props

    return dispatch(createSiteLinkExtensionAction, params, feedId, this.state)
      .then(onSubmit)
  }

  state = {
    sitelinkLine2: '',
    sitelinkLine3: '',
    sitelinkText: '',
    sitelinkFinalUrl: '',
    sitelinkFinalMobileUrl: '',
    sitelinkTrackingUrlTemplate: '',
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

      sitelinkFinalMobileUrl: checked
        ? ''
        : this.state.sitelinkFinalMobileUrl
    })
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <Tabs>
          <Tab id='site-link-required-fields' title={<Message>siteLinkTitle</Message>}>
            <RequiredFields
              {...this.state}
              onChange={this.onChangeText}
              onToggleDevice={this.onToggleDevice}/>
          </Tab>
          <Tab id='site-link-tracking' title={<Message>trackingUrlTitle</Message>}>
            <Tracking
              {...this.state}
              prefix='sitelink'
              onChange={this.onChangeText}/>
          </Tab>
          <Tab id='site-link-period' title={<Message>feedItemPeriodTitle</Message>}>
            <Period
              {...this.state}
              onChangeRange={this.onChangeRange}/>
          </Tab>
          <Tab id='site-link-scheduling' title={<Message>feedItemSchedulingTitle</Message>}>
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

export default styledComponent(NewSiteLink, style)
