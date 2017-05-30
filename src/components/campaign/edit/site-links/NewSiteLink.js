import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import {createSiteLinkExtensionAction} from '../../../../actions/create-site-link'
import Input from '../../../Input'
import Checkbox from '../../../Checkbox'
import set from 'lodash/set'
import map from 'lodash/map'
import {Tab, Tabs} from '../../../Tabs'

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
    urlCustomParameters: [
      {key: '', value: ''},
      {key: '', value: ''},
      {key: '', value: ''}
    ]
  }

  onChangeText = ({target: {name, value}}) => {
    this.setState(set(this.state, name, value))
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
          <Tab id='base' title={<Message>siteLinkTitle</Message>}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <Input
                  required
                  name='sitelinkText'
                  label='sitelinkText'
                  value={this.state.sitelinkText}
                  onChange={this.onChangeText}/>
                <Input
                  required
                  name='sitelinkLine2'
                  label='sitelinkLine2'
                  value={this.state.sitelinkLine2}
                  onChange={this.onChangeText}/>
                <Input
                  required
                  name='sitelinkLine3'
                  label='sitelinkLine3'
                  value={this.state.sitelinkLine3}
                  onChange={this.onChangeText}/>
                <Input
                  required
                  name='sitelinkFinalUrl'
                  label='sitelinkFinalUrl'
                  type='url'
                  value={this.state.sitelinkFinalUrl}
                  onChange={this.onChangeText}/>
              </div>
              <div className='mdl-cell mdl-cell--12-col'>
                <Checkbox
                  name='devicePreference'
                  value='30001'
                  checked={Boolean(this.state.devicePreference)}
                  label={<Message>mobileDevicePreference</Message>}
                  onChange={this.onToggleDevice}/>
              </div>

              {!this.state.devicePreference && (
                <div className='mdl-cell mdl-cell--12-col'>
                  <Input
                    name='sitelinkFinalMobileUrl'
                    label='sitelinkFinalMobileUrl'
                    type='url'
                    value={this.state.sitelinkFinalMobileUrl}
                    onChange={this.onChangeText}/>
                </div>)}
            </div>
          </Tab>
          <Tab id='tracking' title={<Message>trackingUrlTitle</Message>}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <Input
                  name='sitelinkTrackingUrlTemplate'
                  label='sitelinkTrackingUrlTemplate'
                  type='url'
                  value={this.state.sitelinkTrackingUrlTemplate}
                  onChange={this.onChangeText}/>
              </div>
            </div>

            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <h6><Message>urlCustomParameters</Message></h6>
              </div>
            </div>

            {map(this.state.urlCustomParameters, ({key, value}, index) => (
              <div key={index} className='mdl-grid'>
                <div className='mdl-cell mdl-cell--5-col'>
                  <Input
                    name={`urlCustomParameters.${index}.key`}
                    label='urlCustomParameterKey'
                    value={key}
                    onChange={this.onChangeText}/>
                </div>
                <div className='mdl-cell mdl-cell--7-col'>
                  <Input
                    name={`urlCustomParameters.${index}.value`}
                    label='urlCustomParameterValue'
                    value={value}
                    onChange={this.onChangeText}/>
                </div>
              </div>))}
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
