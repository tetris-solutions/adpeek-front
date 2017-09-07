import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import Input from '../../Input'
import Checkbox from '../../Checkbox'
import {style} from '../../campaign/edit/style'

class RequiredFields extends React.PureComponent {
  static displayName = 'Required-Fields'
  static propTypes = {
    sitelinkText: PropTypes.string.isRequired,
    sitelinkLine2: PropTypes.string.isRequired,
    sitelinkLine3: PropTypes.string.isRequired,
    sitelinkFinalUrl: PropTypes.string.isRequired,
    devicePreference: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sitelinkFinalMobileUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onToggleDevice: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className={style.thinForm}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='sitelinkText'
              label='sitelinkText'
              value={this.props.sitelinkText}
              onChange={this.props.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='sitelinkLine2'
              label='sitelinkLine2'
              value={this.props.sitelinkLine2}
              onChange={this.props.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='sitelinkLine3'
              label='sitelinkLine3'
              value={this.props.sitelinkLine3}
              onChange={this.props.onChange}/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='sitelinkFinalUrl'
              label='sitelinkFinalUrl'
              type='url'
              value={this.props.sitelinkFinalUrl}
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
                name='sitelinkFinalMobileUrl'
                label='sitelinkFinalMobileUrl'
                type='url'
                value={this.props.sitelinkFinalMobileUrl}
                onChange={this.props.onChange}/>
            </div>)}
        </div>
      </div>
    )
  }
}

export default RequiredFields
