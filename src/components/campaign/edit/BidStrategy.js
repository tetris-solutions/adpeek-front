import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../Form'
import Radio from '../../Radio'
import map from 'lodash/map'
import {Button, Submit} from '../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import camelCase from 'lodash/camelCase'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}`

const types = [
  'MANUAL_CPC',
  'MANUAL_CPM',
  'PAGE_ONE_PROMOTED',
  'TARGET_SPEND',
  'ENHANCED_CPC',
  'TARGET_CPA',
  'TARGET_ROAS',
  'TARGET_OUTRANK_SHARE'
]

class EditBidStrategy extends React.PureComponent {
  static displayName = 'Edit-Bid-Strategy'

  static propTypes = {
    cancel: PropTypes.func,
    campaign: PropTypes.object,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    type: this.props.campaign.details.bidding_strategy_type
  }

  onChangeType = ({target: {value}}) => {
    this.setState({type: value})
  }

  save = () => {

  }

  render () {
    const {messages} = this.context
    const {type: selectedType} = this.state

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--5-col'>{map(types, currentType =>
            <div key={currentType}>
              <Radio
                value={currentType}
                onChange={this.onChangeType}
                name='type'
                id={`type-${currentType}`}
                checked={currentType === selectedType}>
                {messages[camelCase(currentType) + 'Label'] || currentType}
              </Radio>
            </div>)}
          </div>
          <div className='mdl-cell mdl-cell--7-col'/>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditBidStrategy, style)
