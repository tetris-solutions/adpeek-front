import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import Radio from '../../../Radio'
import map from 'lodash/map'
import {Button, Submit} from '../../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../../higher-order/styled'
import camelCase from 'lodash/camelCase'
import ManualCPC from './ManualCPC'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}`

const types = {
  MANUAL_CPC: ManualCPC,
  MANUAL_CPM: null,
  PAGE_ONE_PROMOTED: null,
  TARGET_SPEND: null,
  ENHANCED_CPC: null,
  TARGET_CPA: null,
  TARGET_ROAS: null,
  TARGET_OUTRANK_SHARE: null
}

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
    enhancedCPC: this.props.campaign.details.enhanced_cpc,
    type: this.props.campaign.details.bidding_strategy_type
  }

  onChangeType = ({target: {value}}) => {
    this.setState({type: value})
  }

  save = () => {

  }

  update = changes => {
    this.setState(changes)
  }

  render () {
    const {messages} = this.context
    const {type: selectedType} = this.state
    const Component = types[selectedType]

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--5-col'>{map(types, (_, type) =>
            <div key={type}>
              <Radio
                value={type}
                onChange={this.onChangeType}
                name='type'
                id={`type-${type}`}
                checked={type === selectedType}>
                {messages[camelCase(type) + 'Label'] || type}
              </Radio>
            </div>)}
          </div>
          <div className='mdl-cell mdl-cell--7-col'>
            {Component
              ? <Component {...this.state} update={this.update}/>
              : null}
          </div>
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
