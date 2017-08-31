import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Button} from '../../../Button'
import {loadCampaignOrderAction} from '../../../../actions/load-campaign-order'

const CampaignOrder = ({cancel, params: {company, workspace, folder, campaign}, order: {id, name, budget}}) => (
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
      <Button className='mdl-button mdl-button--raised' onClick={cancel}>
        <Message>cancel</Message>
      </Button>
      <Link
        style={{float: 'right'}}
        className='mdl-button mdl-button--raised mdl-button--colored'
        to={`/c/${company}/w/${workspace}/f/${folder}/o/${id}/budget/${budget.id}`}>
        <Message>editBudget</Message>
      </Link>
    </p>
  </div>
)
CampaignOrder.displayName = 'campaign-Order'
CampaignOrder.propTypes = {
  cancel: PropTypes.func,
  params: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired
}

const CreateOrderPrompt = ({cancel, params: {company, workspace, folder, campaign}}) => (
  <div>
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <p>
          <Message>cannotEditDeliveryMethodWithoutOrder</Message>
        </p>
      </div>
    </div>
    <div>
      <Button className='mdl-button mdl-button--raised' onClick={cancel}>
        <Message>cancel</Message>
      </Button>

      <Link
        style={{float: 'right'}}
        className='mdl-button mdl-button--raised mdl-button--colored'
        to={`/c/${company}/w/${workspace}/f/${folder}/orders`}>
        <Message>openOrders</Message>
      </Link>
    </div>
  </div>
)
CreateOrderPrompt.displayName = 'Create-Order-Prompt'
CreateOrderPrompt.propTypes = {
  cancel: PropTypes.func,
  params: PropTypes.object
}

class EditDeliveryMethod extends React.Component {
  static displayName = 'Edit-DeliveryMethod'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
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

    const {campaign: {order}, params} = this.props

    return order
      ? <CampaignOrder params={params} order={order} cancel={this.props.cancel}/>
      : <CreateOrderPrompt params={params} cancel={this.props.cancel}/>
  }
}

export default EditDeliveryMethod
