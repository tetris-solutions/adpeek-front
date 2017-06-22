import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import {Button} from '../Button'
import capitalize from 'lodash/capitalize'
import map from 'lodash/map'
import Input from '../Input'
import head from 'lodash/head'
import {Tabs, Tab} from '../Tabs'

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

  static contextTypes = {
    messages: PropTypes.object
  }

  render () {
    const keyword = this.props
    const {messages} = this.context
    const {onChange, close} = this.props
    const biddable = keyword.criterion_use === 'BIDDABLE'

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>{keyword.text}</h5>
            <br/>

            <Select name='status' label='keywordStatus' text='status' value={keyword.status} onChange={onChange}>
              {map(statuses[keyword.criterion_use], currentStatus =>
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
                value={keyword.cpc_bid}
                onChange={onChange}/>
            </div>)}

          {biddable && (
            <div className='mdl-cell mdl-cell--12-col'>
              <Tabs>
                <Tab id='keyword-final-url' title={messages.finalUrlLabel}>
                  <br/>
                  <Input
                    type='url'
                    name='final_urls'
                    label='finalUrl'
                    value={head(keyword.final_urls) || ''}
                    onChange={onChange}/>
                </Tab>
                <Tab id='destination-url' title={messages.destinationUrlLabel}>
                  <br/>
                  <Input
                    type='url'
                    name='destination_url'
                    label='destinationUrl'
                    value={head(keyword.destination_url) || ''}
                    onChange={onChange}/>
                </Tab>
              </Tabs>
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
