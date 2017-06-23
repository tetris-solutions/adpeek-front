import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import {Button} from '../Button'
import capitalize from 'lodash/capitalize'
import {loadAdGroupDetailsAction} from '../../actions/load-adgroup-details'
import AdGroupDetails from './AdGroupDetails'

class AdGroupEdit extends React.Component {
  static displayName = 'Ad-Group-Edit'

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
    details: PropTypes.object,
    name: PropTypes.string,
    status: PropTypes.string,
    onChange: PropTypes.func,
    close: PropTypes.func
  }

  state = {
    modalOpen: false
  }

  componentDidMount () {
    const {dispatch, params} = this.props

    dispatch(loadAdGroupDetailsAction, params)
  }

  render () {
    const {name, status, details, onChange, close} = this.props

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

            {details
              ? <AdGroupDetails {...details}/>
              : <p><Message>loadingAdGroupDetails</Message></p>}
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
