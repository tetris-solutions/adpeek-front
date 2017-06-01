import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import {createSiteLinkExtensionAction} from '../../../../actions/create-site-link'
import set from 'lodash/set'
import {Tab, Tabs} from '../../../Tabs'
import RequiredFields from './RequiredFields'
import Tracking from './Tracking'
import Period from '../shared/Period'
import concat from 'lodash/concat'
import Scheduling from '../shared/Scheduling'
import filter from 'lodash/filter'

class NewSiteLink extends React.Component {
  static displayName = 'New-Site-Link'

  static propTypes = {
    feedId: PropTypes.string,
    folder: PropTypes.object,
    cancel: PropTypes.func,
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    campaign: PropTypes.object
  }

  static contextTypes = {
    moment: PropTypes.func
  }

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

  onChangeText = ({target: {name, value}}) => {
    this.setState(set(this.state, name, value))
  }

  onChangeRange = ({startDate, endDate}) => {
    this.setState({
      startTime: startDate
        ? startDate.format('YYYY-MM-DD')
        : null,
      endTime: endDate
        ? endDate.format('YYYY-MM-DD')
        : null
    })
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

  addSchedule = () => {
    this.setState({
      scheduling: concat(this.state.scheduling, {
        id: Math.random().toString(36).substr(2),
        dayOfWeek: 'ALL_WEEK',
        startHour: '0',
        startMinute: 'ZERO',
        endHour: '0',
        endMinute: 'ZERO'
      })
    })
  }

  removeSchedule = rmIndex => {
    this.setState({
      scheduling: filter(this.state.scheduling, (_, index) => index !== rmIndex)
    })
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <Tabs>
          <Tab id='base' title={<Message>siteLinkTitle</Message>}>
            <RequiredFields
              {...this.state}
              onChange={this.onChangeText}
              onToggleDevice={this.onToggleDevice}/>
          </Tab>
          <Tab id='tracking' title={<Message>siteLinkTrackingUrlTitle</Message>}>
            <Tracking
              {...this.state}
              onChange={this.onChangeText}/>
          </Tab>
          <Tab id='period' title={<Message>siteLinkPeriodTitle</Message>}>
            <Period
              {...this.state}
              onChangeRange={this.onChangeRange}/>
          </Tab>
          <Tab id='scheduling' title={<Message>siteLinkSchedulingTitle</Message>}>
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
