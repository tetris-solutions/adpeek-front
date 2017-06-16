import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import {Button} from '../Button'
import capitalize from 'lodash/capitalize'
import map from 'lodash/map'

const statuses = {
  NEGATIVE: ['ENABLED', 'REMOVED'],
  BIDDABLE: ['ENABLED', 'PAUSED', 'REMOVED']
}

class KeywordEdit extends React.Component {
  static displayName = 'Keyword-Edit'

  static propTypes = {
    name: PropTypes.node,
    criterionUse: PropTypes.string,
    status: PropTypes.string,
    onChange: PropTypes.func,
    close: PropTypes.func
  }

  render () {
    const {name, criterionUse, status, onChange, close} = this.props

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>{name}</h5>
            <br/>

            <Select label='adStatus' name='status' value={status} onChange={onChange}>
              {map(statuses[criterionUse], currentStatus =>
                <option key={currentStatus} value={currentStatus}>
                  {capitalize(currentStatus)}
                </option>)}
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

export default KeywordEdit
