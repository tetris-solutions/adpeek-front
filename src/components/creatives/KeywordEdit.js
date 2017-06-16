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
    text: PropTypes.node,
    criterion_use: PropTypes.string,
    status: PropTypes.string,
    onChange: PropTypes.func,
    close: PropTypes.func
  }

  render () {
    const {text, criterion_use, status, onChange, close} = this.props

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>{text}</h5>
            <br/>

            <Select name='status' label='keywordStatus' text='status' value={status} onChange={onChange}>
              {map(statuses[criterion_use], currentStatus =>
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
