import React from 'react'
import PropTypes from 'prop-types'
import campaignType from '../../../propTypes/campaign'
import {node} from '../../higher-order/branch'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import cx from 'classnames'

class BudgetCampaign extends React.Component {
  static displayName = 'Budget-Campaign'
  static propTypes = {
    campaign: campaignType.isRequired,
    budget: PropTypes.shape({
      campaigns: PropTypes.array
    }),
    actionIcon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    maybeDisabled: PropTypes.bool
  }

  state = {
    modalOpen: false
  }

  isEmptyBudget () {
    return isEmpty(this.props.budget.campaigns)
  }

  isFacebook () {
    return this.props.campaign.platform === 'facebook'
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

  closeModal = () => {
    this.setState({modalOpen: false})
  }

  onClick = e => {
    e.preventDefault()
    if (this.isAllowed()) {
      this.props.onClick(this.props.campaign)
    } else {
      this.setState({modalOpen: true})
    }
  }

  render () {
    const {campaign, actionIcon} = this.props
    const disabled = !this.isAllowed()
    const lClasses = cx({
      'mdl-list__item-secondary-action': true,
      'mdl-color-text--red-900': disabled
    })

    return (
      <div className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar' title={campaign.status.description}>
            {campaign.status.icon}
          </i>
          <span>{campaign.name}</span>
        </span>
        <a className={lClasses} onClick={this.onClick}>
          <i className='material-icons'>
            {disabled ? 'info_outline' : actionIcon}
          </i>
        </a>
        {this.state.modalOpen && (
          <Modal size='small' onEscPress={this.closeModal} minHeight={0} className='mdl-color--yellow-400'>
            {this.isFacebook() && <Message html>facebookBudgetDisallowInsert</Message>}
            {this.isConversionOptimized() && <Message html>conversionOptimizedDisallowInsert</Message>}
          </Modal>
        )}
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
