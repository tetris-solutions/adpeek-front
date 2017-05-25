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
import EnhancedCPC from './EnhancedCPC'
import {updateCampaignBidStrategyAction} from '../../../../actions/update-campaign-bid-strategy'
import {loadFolderBidStrategiesAction} from '../../../../actions/load-folder-bid-strategies'

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
  ENHANCED_CPC: EnhancedCPC,
  MANUAL_CPM: null,
  PAGE_ONE_PROMOTED: null,
  TARGET_SPEND: null,
  TARGET_CPA: null,
  TARGET_ROAS: null,
  TARGET_OUTRANK_SHARE: null
}

const parseBidStrategy = ({details}) => ({
  strategyId: details.bidding_strategy_id,
  strategyName: details.bidding_strategy_name,
  enhancedCPC: details.enhanced_cpc,
  type: details.bidding_strategy_type
})

class EditBidStrategy extends React.PureComponent {
  static displayName = 'Edit-Bid-Strategy'

  static propTypes = {
    cancel: PropTypes.func,
    folder: PropTypes.object,
    campaign: PropTypes.object,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = parseBidStrategy(this.props.campaign)

  componentDidMount () {
    if (!this.props.folder.bidStrategies) {
      this.loadStrategies()
    }
  }

  loadStrategies = () => {
    return this.props.dispatch(loadFolderBidStrategiesAction, this.props.params)
  }

  onChangeType = ({target: {value}}) => {
    this.setState({type: value})
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props

    return dispatch(updateCampaignBidStrategyAction, params, this.state)
      .then(this.state.strategyId ? undefined : this.loadStrategies)
      .then(onSubmit)
  }

  update = changes => {
    this.setState(changes)
  }

  render () {
    const {folder, campaign} = this.props
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
          <div className='mdl-cell mdl-cell--7-col'>{Component ? (
            <Component
              {...this.state}
              defaultStrategyName={`${campaign.name} - ${messages[camelCase(selectedType) + 'Label'] || selectedType}`}
              bidStrategies={folder.bidStrategies}
              update={this.update}/>) : null}
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
