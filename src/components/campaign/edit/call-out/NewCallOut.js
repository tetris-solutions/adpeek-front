import React from 'react'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
// import {createCallOutExtensionAction} from '../../../../actions/create-call-out'
import {Tab, Tabs} from '../../../Tabs'
import RequiredFields from './RequiredFields'
import Period from '../shared/Period'
import NewFeedItem from '../shared/NewFeedItem'
import Scheduling from '../shared/Scheduling'

class NewCallOut extends NewFeedItem {
  static displayName = 'New-Call-Out'

  // save = () => {
  //   const {dispatch, feedId, onSubmit, params} = this.props
  //
  //   return dispatch(createCallOutExtensionAction, params, feedId, this.state)
  //     .then(onSubmit)
  // }

  state = {
    calloutText: '',
    devicePreference: null,
    startTime: null,
    endTime: null,
    scheduling: []
  }

  onToggleDevice = ({target: {checked, value}}) => {
    this.setState({
      devicePreference: checked
        ? Number(value)
        : null
    })
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <Tabs>
          <Tab id='base' title={<Message>callOutTitle</Message>}>
            <RequiredFields
              {...this.state}
              onChange={this.onChangeText}
              onToggleDevice={this.onToggleDevice}/>
          </Tab>
          <Tab id='period' title={<Message>feedItemPeriodTitle</Message>}>
            <Period
              {...this.state}
              onChangeRange={this.onChangeRange}/>
          </Tab>
          <Tab id='scheduling' title={<Message>feedItemSchedulingTitle</Message>}>
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

export default styledComponent(NewCallOut, style)
