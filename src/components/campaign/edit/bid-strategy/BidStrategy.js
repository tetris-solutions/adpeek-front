import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import Radio from '../../../Radio'
import LoadingHorizontal from '../../../LoadingHorizontal'
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
import TargetSpend from './TargetSpend'
import {updateCampaignBidStrategyAction} from '../../../../actions/update-campaign-bid-strategy'
import {loadFolderBidStrategiesAction} from '../../../../actions/load-folder-bid-strategies'
import isNumber from 'lodash/isNumber'
import includes from 'lodash/includes'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}`

const changed = (a, b) => (
  a !== undefined &&
  b !== undefined &&
  a !== b
)

const isset = a => a !== undefined
const types = {
  MANUAL_CPC: ManualCPC,
  ENHANCED_CPC: EnhancedCPC,
  TARGET_CPA: TargetCPA,
  TARGET_ROAS: TargetROAS,
  TARGET_SPEND: TargetSpend,
  MANUAL_CPM: null,
  PAGE_ONE_PROMOTED: null,
  TARGET_OUTRANK_SHARE: null
}

const sharedOnly = [
  'ENHANCED_CPC',
  'TARGET_OUTRANK_SHARE',
  'PAGE_ONE_PROMOTED'
]

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
    this.loadStrategies()
      .then(this.initialize)
  }

  initialize = () => {
    const {campaign: {details}} = this.props

    this.update({
      isLoading: false,
      strategyName: null,
      strategyId: details.bidding_strategy_id,
      enhancedCPC: details.enhanced_cpc,
      type: details.bidding_strategy_type,
      targetCPA: details.cpa,
      targetROAS: details.roas,
      spendBidCeiling: details.spend_bid_ceiling,
      spendEnhancedCPC: details.spend_enhanced_cpc
    })
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

    if (changed(newState.type, currentState.type)) {
      newState.strategyId = isset(newState.strategyId)
        ? newState.strategyId
        : null

      newState.useSharedStrategy = includes(sharedOnly, type)
    }

    if (changed(newState.useSharedStrategy, currentState.useSharedStrategy)) {
      // will change to shared strategy mode
      // should empty strategy selection
      newState.strategyId = null
    } else if (newState.strategyId) {
      newState.useSharedStrategy = true
    }

    newState.useSharedStrategy = isset(newState.useSharedStrategy)
      ? newState.useSharedStrategy
      : currentState.useSharedStrategy

    if (isset(newState.strategyId)) {
      const selectedStrategy = find(this.props.folder.bidStrategies, {
        id: newState.strategyId
      })

      if (newState.strategyId || newState.useSharedStrategy === false) {
        // use strategy name instead
        newState.strategyName = null
      } else if (
        !newState.strategyName &&
        newState.useSharedStrategy
      ) {
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

        case 'TARGET_SPEND':
          if (newState.useSharedStrategy) {
            newState.spendEnhancedCPC = null
          } else {
            newState.spendEnhancedCPC = isset(newState.spendEnhancedCPC)
              ? newState.spendEnhancedCPC
              : currentState.spendEnhancedCPC
          }

          newState.spendBidCeiling = isNumber(newState.spendBidCeiling)
            ? newState.spendBidCeiling
            : get(selectedStrategy, 'scheme.bidCeiling', currentState.spendBidCeiling)
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

  state = {
    isLoading: true
  }

  render () {
    const {folder} = this.props
    const {messages} = this.context
    const {isLoading, type: selectedType} = this.state
    const Component = types[selectedType]

    if (isLoading) {
      return (
        <LoadingHorizontal>
          <Message>loadingBidStrategies</Message>
        </LoadingHorizontal>
      )
    }

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
          <div className='mdl-cell mdl-cell--7-col'>{Component && (
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
