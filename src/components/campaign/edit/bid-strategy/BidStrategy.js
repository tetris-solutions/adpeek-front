import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import Radio from '../../../Radio'
import LoadingHorizontal from '../../../LoadingHorizontal'
import assign from 'lodash/assign'
import map from 'lodash/map'
import find from 'lodash/find'
import omit from 'lodash/omit'
import {Button, Submit} from '../../../Button'
import csjs from 'csjs'
import {styledComponent} from '../../../higher-order/styled'
import camelCase from 'lodash/camelCase'
import ManualCPC from './ManualCPC'
import TargetCPA from './TargetCPA'
import TargetROAS from './TargetROAS'
import EnhancedCPC from './EnhancedCPC'
import TargetSpend from './TargetSpend'
import TargetOutrankShare from './TargetOutrankShare'
import PageOnePromoted from './PageOnePromoted'
import {updateCampaignBidStrategyAction} from '../../../../actions/update-campaign-bid-strategy'
import {loadFolderBidStrategiesAction} from '../../../../actions/load-folder-bid-strategies'
import isNumber from 'lodash/isNumber'
import includes from 'lodash/includes'
import isString from 'lodash/isString'
import identity from 'lodash/identity'
import {isDisplayCampaign, campaignNetworks} from '../Network'

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
  PAGE_ONE_PROMOTED: PageOnePromoted,
  TARGET_OUTRANK_SHARE: TargetOutrankShare,
  MANUAL_CPM: identity(null)
}

const sharedOnly = [
  'ENHANCED_CPC',
  'TARGET_OUTRANK_SHARE',
  'PAGE_ONE_PROMOTED'
]

function normalizeScheme (originalValue = {}) {
  const scheme = assign({}, originalValue.scheme)

  if (isNumber(scheme.targetRoas)) {
    scheme.targetRoas = scheme.targetRoas * 100
  }

  if (isNumber(scheme.targetOutrankShare)) {
    scheme.targetOutrankShare = scheme.targetOutrankShare / 10000
  }

  return scheme
}

const firstNumber = (...args) => find(args, isNumber)
const firstString = (...args) => find(args, isString)

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
      const scheme = normalizeScheme(find(this.props.folder.bidStrategies, {id: newState.strategyId}))

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
          newState.targetCPA = firstNumber(
            newState.targetCPA,
            scheme.targetCpa,
            currentState.targetCPA)
          break

        case 'TARGET_ROAS':
          newState.targetROAS = firstNumber(
            newState.targetROAS,
            scheme.targetRoas,
            currentState.targetROAS)
          break

        case 'TARGET_SPEND':
          if (newState.useSharedStrategy) {
            newState.spendEnhancedCPC = null
          } else if (!isset(newState.spendEnhancedCPC)) {
            newState.spendEnhancedCPC = currentState.spendEnhancedCPC
          }

          newState.spendBidCeiling = firstNumber(
            newState.spendBidCeiling,
            scheme.bidCeiling,
            currentState.spendBidCeiling)
          break

        case 'PAGE_ONE_PROMOTED':
          newState.strategyGoal = firstString(
            newState.strategyGoal,
            scheme.strategyGoal,
            currentState.strategyGoal,
            'PAGE_ONE')

          break

        case 'TARGET_OUTRANK_SHARE':
          newState.targetOutrankShare = firstNumber(
            newState.targetOutrankShare,
            scheme.targetOutrankShare,
            currentState.targetOutrankShare)

          newState.competitorDomain = firstString(
            newState.competitorDomain,
            scheme.competitorDomain,
            currentState.competitorDomain)

          newState.outrankBidCeiling = firstNumber(
            newState.outrankBidCeiling,
            scheme.maxCpcBidCeiling,
            currentState.outrankBidCeiling)
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
    const {folder, campaign} = this.props
    const {messages} = this.context
    const {isLoading, type: selectedType} = this.state
    const Component = types[selectedType]
    const availableTypes = isDisplayCampaign(campaignNetworks(campaign))
      ? types
      : omit(types, 'MANUAL_CPM')

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
          <div className='mdl-cell mdl-cell--5-col'>{map(availableTypes, (_, type) =>
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
