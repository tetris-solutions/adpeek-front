import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Input from '../../../Input'
import Checkbox from '../../../Checkbox'
import {style} from '../style'

class RequiredFields extends React.PureComponent {
  static displayName = 'Required-Fields'
  static propTypes = {
    calloutText: PropTypes.string.isRequired,
    devicePreference: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onToggleDevice: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className={style.thinForm}>
        <br/>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              name='calloutText'
              label='calloutText'
              value={this.props.calloutText}
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
        </div>
      </div>
    )
  }
}

export default RequiredFields
