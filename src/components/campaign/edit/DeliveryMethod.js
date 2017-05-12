import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Button} from '../../Button'
import {loadCampaignOrderAction} from '../../../actions/load-campaign-order'
import noop from 'lodash/noop'

const CampaignOrder = ({close, params: {company, workspace, folder, campaign}, order: {id, name, budget}}) => (
  <div>
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <p>
          <Message html order={name} budget={budget.name}>
            campaignOrderDeliveryMethod
          </Message>
        </p>
      </div>
    </div>
    <p>
      <Button className='mdl-button mdl-button--raised' onClick={close}>
        <Message>cancel</Message>
      </Button>
      <Link
        style={{float: 'right'}}
        className='mdl-button mdl-button--raised mdl-button--colored'
        to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${id}/budget/${budget.id}`}>
        <Message>editBudget</Message>
      </Link>
    </p>
  </div>
)
CampaignOrder.displayName = 'campaign-Order'
CampaignOrder.propTypes = {
  close: PropTypes.func,
  params: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired
}

const CreateOrderPrompt = ({close, params: {company, workspace, folder, campaign}}) => (
  <div>
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <p>
          <Message>cannotEditDeliveryMethodWithoutOrder</Message>
        </p>
      </div>
    </div>
    <div>
      <Button className='mdl-button mdl-button--raised' onClick={close}>
        <Message>cancel</Message>
      </Button>

      <Link
        style={{float: 'right'}}
        className='mdl-button mdl-button--raised mdl-button--colored'
        to={`/company/${company}/workspace/${workspace}/folder/${folder}/orders`}>
        <Message>openOrders</Message>
      </Link>
    </div>
  </div>
)
CreateOrderPrompt.displayName = 'Create-Order-Prompt'
CreateOrderPrompt.propTypes = {
  close: PropTypes.func,
  params: PropTypes.object
}

class EditDeliveryMethod extends React.Component {
  static displayName = 'Edit-DeliveryMethod'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func
  }

  static defaultProps = {
    onSubmit: noop
  }

  state = {
    isLoading: !this.props.campaign.order
  }

  componentDidMount () {
    if (this.state.isLoading) {
      this.loadOrder()
    }
  }

  loadOrder () {
    const {params, dispatch} = this.props
    const done = () => this.setState({isLoading: false})

    dispatch(loadCampaignOrderAction, params)
      .then(done, done)
  }

  render () {
    if (this.state.isLoading) {
      return (
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <p>
              <Message>loadingCampaignOrder</Message>
            </p>
          </div>
        </div>
      )
    }

    const {onSubmit, campaign: {order}, params} = this.props

    return order
      ? <CampaignOrder params={params} order={order} close={onSubmit}/>
      : <CreateOrderPrompt params={params} close={onSubmit}/>
  }
}

export default EditDeliveryMethod
