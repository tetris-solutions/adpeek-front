import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import Radio from '../../../Radio'
import {Submit, Button} from '../../../Button'
import Form from '../../../Form'
import {updateCampaignStatusAction} from '../../../../actions/update-campaign-status'
import map from 'lodash/map'
import capitalize from 'lodash/capitalize'

const campaignStatuses = {adwords: ['ENABLED', 'PAUSED', 'REMOVED']}

class EditStatus extends React.Component {
  static displayName = 'Edit-Status'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
  }

  state = this.props.campaign.status

  onChange = ({target}) => {
    this.setState({status: target.value})
  }

  save = () => {
    const {cancel, params, dispatch} = this.props

    return dispatch(updateCampaignStatusAction, params, this.state.status)
      .then(cancel)
  }

  render () {
    const {platform} = this.props.campaign

    return (
      <Form onSubmit={this.save} className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h5>
            <Message>campaignStatusLabel</Message>
          </h5>
        </div>

        <br/>

        {map(campaignStatuses[platform], status =>
          <div key={status} className='mdl-cell mdl-cell--12-col'>
            <Radio
              name='status'
              id={`${status}-status`}
              onChange={this.onChange}
              value={status}
              checked={status === this.state.status}>
              {capitalize(status)}
            </Radio>
          </div>)}

        <br/>

        <div className='mdl-cell mdl-cell--12-col'>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit style={{float: 'right'}} className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default EditStatus
