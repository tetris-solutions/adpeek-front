import React from 'react'
import PropTypes from 'prop-types'
import campaignType from '../../../propTypes/campaign'
import {node} from '../../higher-order/branch'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import cx from 'classnames'
import {loadCampaignBiddingStrategyAction} from '../../../actions/load-campaign-bidding-strategy'

class BudgetCampaign extends React.Component {
  static displayName = 'Budget-Campaign'
  static propTypes = {
    campaign: campaignType.isRequired,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    budget: PropTypes.shape({
      campaigns: PropTypes.array
    }),
    actionIcon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    maybeDisabled: PropTypes.bool
  }
  static contextTypes = {
    messages: PropTypes.object.isRequired
  }

  componentDidMount () {
    const {campaign: {biddingStrategy, platform}, maybeDisabled} = this.props

    const shouldLoadBidStrategy = (
      platform === 'adwords' &&
      maybeDisabled &&
      !biddingStrategy &&
      !this.isRemoved()
    )

    if (shouldLoadBidStrategy) {
      this.props.dispatch(
        loadCampaignBiddingStrategyAction,
        this.props.params
      )
    }
  }

  isEmptyBudget () {
    return isEmpty(this.props.budget.campaigns)
  }

  isFacebook () {
    return this.props.campaign.platform === 'facebook'
  }

  isRemoved () {
    return this.props.campaign.status.status === 'REMOVED'
  }

  isConversionOptimized () {
    return get(this.props.campaign, 'biddingStrategy.type') === 'UNKNOWN'
  }

  isAllowed () {
    return (
      !this.props.maybeDisabled ||
      this.isEmptyBudget() || (
        !this.isFacebook() &&
        !this.isConversionOptimized()
      )
    )
  }

  onClick = e => {
    e.preventDefault()

    if (this.isAllowed()) {
      this.props.onClick(this.props.campaign)
    }
  }

  render () {
    const {campaign, actionIcon} = this.props
    const disabled = !this.isAllowed()
    const linkClasses = cx({
      'mdl-list__item-secondary-action': true,
      'mdl-color-text--grey-600': disabled
    })
    const {messages} = this.context
    let linkTitle = messages.addToBudget

    if (disabled) {
      if (this.isFacebook()) {
        linkTitle = messages.facebookBudgetDisallowInsert
      } else if (this.isConversionOptimized()) {
        linkTitle = messages.conversionOptimizedDisallowInsert
      } else if (this.isRemoved()) {
        linkTitle = messages.removedCampaignDisallow
      }
    }

    return (
      <div className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar' title={campaign.status.description}>
            {campaign.status.icon}
          </i>
          <span>{campaign.name}</span>
        </span>

        <a className={linkClasses} title={linkTitle} onClick={this.onClick}>
          <i className='material-icons'>
            {disabled ? 'info_outline' : actionIcon}
          </i>
        </a>
      </div>
    )
  }
}

const B = node('folder', 'campaign', BudgetCampaign)

const C = props =>
  <B {...props} params={{campaign: props.campaign.id}}/>

C.displayName = 'Campaign-Wrapper'
C.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
}

export default C
