import React from 'react'
import PropTypes from 'prop-types'
import Select from '../Select'
import capitalize from 'lodash/capitalize'

class AdGroupEdit extends React.Component {
  static displayName = 'Ad-Group-Edit'

  static propTypes = {
    name: PropTypes.string,
    status: PropTypes.string,
    onChange: PropTypes.func
  }

  render () {
    const {name, status, onChange} = this.props

    return (
      <div style={{textAlign: 'center'}}>
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
    )
  }
}

export default AdGroupEdit
