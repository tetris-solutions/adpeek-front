import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import {Button} from '../Button'
import capitalize from 'lodash/capitalize'

class AdGroupEdit extends React.Component {
  static displayName = 'Ad-Group-Edit'

  static propTypes = {
    name: PropTypes.string,
    status: PropTypes.string,
    onChange: PropTypes.func,
    close: PropTypes.func
  }

  render () {
    const {name, status, onChange, close} = this.props

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>{name}</h5>

            <br/>

            <Select label='adGroupStatus' name='status' value={status} onChange={onChange}>
              <option value='ENABLED'>
                {capitalize('ENABLED')}
              </option>

              <option value='PAUSED'>
                {capitalize('PAUSED')}
              </option>

              <option value='REMOVED'>
                {capitalize('REMOVED')}
              </option>
            </Select>
          </div>
        </div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col' style={{textAlign: 'right'}}>
            <Button className='mdl-button' onClick={close}>
              <Message>close</Message>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default AdGroupEdit
