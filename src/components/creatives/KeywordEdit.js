import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import Select from '../Select'
import {Button} from '../Button'
import capitalize from 'lodash/capitalize'
import map from 'lodash/map'
import Input from '../Input'
import head from 'lodash/head'
import {bidType, pickBid} from './AdGroupEdit'

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
    close: PropTypes.func,
    cpc_bid: bidType,
    final_urls: PropTypes.array,
    suggestedUrl: PropTypes.string
  }

  onClickSuggestion = e => {
    e.preventDefault()

    this.props.onChange({
      target: {
        name: 'final_urls',
        value: this.props.suggestedUrl
      }
    })
  }

  render () {
    const {onChange, close, suggestedUrl} = this.props
    const biddable = this.props.criterion_use === 'BIDDABLE'
    const finalUrl = head(this.props.final_urls) || ''

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>{this.props.text}</h5>
            <br/>

            <Select name='status' label='keywordStatus' text='status' value={this.props.status} onChange={onChange}>
              {map(statuses[this.props.criterion_use], currentStatus =>
                <option key={currentStatus} value={currentStatus}>
                  {capitalize(currentStatus)}
                </option>)}
            </Select>
          </div>

          {biddable && (
            <div className='mdl-cell mdl-cell--12-col'>
              <Input
                type='number'
                format='currency'
                name='cpc_bid'
                label='cpcBid'
                value={pickBid(this.props.cpc_bid)}
                onChange={onChange}/>
            </div>)}

          {biddable && (
            <div className='mdl-cell mdl-cell--12-col'>
              <Input
                type='url'
                name='final_urls'
                label='finalUrl'
                value={finalUrl}
                onChange={onChange}/>

              {!finalUrl && suggestedUrl && (
                <p onClick={this.onClickSuggestion}>
                  <em>
                    <Message html url={suggestedUrl}>
                      suggestedUrl
                    </Message>
                  </em>
                </p>)}
            </div>)}

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
