import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Input from '../../../Input'
import Select from '../../../Select'
import Checkbox from '../../../Checkbox'
import {style} from '../style'

class RequiredFields extends React.PureComponent {
  static displayName = 'Required-Fields'
  static propTypes = {
    appLinkText: PropTypes.string.isRequired,
    appStore: PropTypes.oneOf(['APPLE_ITUNES', 'GOOGLE_PLAY']).isRequired,
    appId: PropTypes.string.isRequired,
    appFinalUrl: PropTypes.string.isRequired,
    devicePreference: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    appFinalMobileUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onToggleDevice: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className={style.thinForm}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='appStore'
              label='appStore'
              value={this.props.appStore}
              onChange={this.props.onChange}>
              <option value='GOOGLE_PLAY'>Android</option>
              <option value='APPLE_ITUNES'>iOS</option>
            </Select>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='appId'
              label='appId'
              value={this.props.appId}
              onChange={this.props.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='appLinkText'
              label='appLinkText'
              value={this.props.appLinkText}
              onChange={this.props.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='appFinalUrl'
              label='appFinalUrl'
              type='url'
              value={this.props.appFinalUrl}
              onChange={this.props.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Checkbox
              name='devicePreference'
              value='30001'
              checked={Boolean(this.props.devicePreference)}
              label={<Message>mobileDevicePreference</Message>}
              onChange={this.props.onToggleDevice}/>
          </div>

          {!this.props.devicePreference && (
            <div className='mdl-cell mdl-cell--12-col'>
              <Input
                name='appFinalMobileUrl'
                label='appFinalMobileUrl'
                type='url'
                value={this.props.appFinalMobileUrl}
                onChange={this.props.onChange}/>
            </div>)}
        </div>
      </div>
    )
  }
}

export default RequiredFields
