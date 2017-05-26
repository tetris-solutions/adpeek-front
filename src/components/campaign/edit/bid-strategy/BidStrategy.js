import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import Radio from '../../../Radio'
import assign from 'lodash/assign'
import map from 'lodash/map'
import find from 'lodash/find'
import get from 'lodash/get'
import {Button, Submit} from '../../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../../higher-order/styled'
import camelCase from 'lodash/camelCase'
import ManualCPC from './ManualCPC'
import TargetCPA from './TargetCPA'
import TargetROAS from './TargetROAS'
import EnhancedCPC from './EnhancedCPC'
import {updateCampaignBidStrategyAction} from '../../../../actions/update-campaign-bid-strategy'
import {loadFolderBidStrategiesAction} from '../../../../actions/load-folder-bid-strategies'
import isNumber from 'lodash/isNumber'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}`

const isset = a => a !== undefined
const types = {
  MANUAL_CPC: ManualCPC,
  ENHANCED_CPC: EnhancedCPC,
  TARGET_CPA: TargetCPA,
  TARGET_ROAS: TargetROAS,
  MANUAL_CPM: null,
  PAGE_ONE_PROMOTED: null,
  TARGET_SPEND: null,
  TARGET_OUTRANK_SHARE: null
}

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

  componentDidMount () {
    this.loadStrategies().then(() =>
      this.update(assign({}, this.state, {
        isLoading: false
      })))
  }

  loadStrategies = () => {
    return this.props.dispatch(loadFolderBidStrategiesAction, this.props.params)
  }

  onChangeType = ({target: {value}}) => {
    this.update({type: value})
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props

    return dispatch(updateCampaignBidStrategyAction, params, this.state)
      .then(onSubmit)
  }

  normalize = (newState, currentState = this.state) => {
    const type = newState.type || currentState.type

    if (isset(newState.type)) {
      newState.strategyId = isset(newState.strategyId)
        ? newState.strategyId
        : null
    }

    if (isset(newState.strategyId)) {
      const selectedStrategy = find(this.props.folder.bidStrategies, {
        id: newState.strategyId
      })

      if (selectedStrategy) {
        // use strategy name instead
        newState.strategyName = null
      } else if (!newState.strategyName) {
        // changed to new strategy option, set default name
        newState.strategyName = this.getDefaultStrategyName(type)
      }

      switch (type) {
        case 'TARGET_CPA':
          newState.targetCPA = isNumber(newState.targetCPA)
            ? newState.targetCPA
            : get(selectedStrategy, 'scheme.targetCpa', currentState.targetCPA)
          break

        case 'TARGET_ROAS':
          newState.targetROAS = isNumber(newState.targetROAS)
            ? newState.targetROAS
            : get(selectedStrategy, 'scheme.targetRoas', currentState.targetROAS)
          break
      }
    }

    return newState
  }

  update = changes => {
    this.setState(this.normalize(changes))
  }

  getDefaultStrategyName = (selectedType = this.state.type) => {
    return `${this.props.campaign.name} - ${this.context.messages[camelCase(selectedType) + 'Label'] || selectedType}`
  }

  state = this.normalize({
    isLoading: true,
    strategyId: this.props.campaign.details.bidding_strategy_id,
    strategyName: this.props.campaign.details.bidding_strategy_name,
    enhancedCPC: this.props.campaign.details.enhanced_cpc,
    type: this.props.campaign.details.bidding_strategy_type,
    targetCPA: this.props.campaign.details.cpa,
    targetROAS: this.props.campaign.details.roas
  }, {})

  render () {
    const {folder} = this.props
    const {messages} = this.context
    const {isLoading, type: selectedType} = this.state
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
          <div className='mdl-cell mdl-cell--7-col'>{isLoading
            ? (
              <p>
                <Message tag='em'>loadingBidStrategies</Message>
              </p>
            ) : Component && (
              <Component
                {...this.state}
                bidStrategies={folder.bidStrategies}
                update={this.update}/>)}
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
