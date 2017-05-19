import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import Input from '../../Input'
import {Submit, Button} from '../../Button'
import Form from '../../Form'
import {updateCampaignNameAction} from '../../../actions/update-campaign-name'
import noop from 'lodash/noop'

class EditName extends React.Component {
  static displayName = 'Edit-Name'

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
    name: this.props.campaign.name
  }

  onChange = ({target}) => {
    this.setState({name: target.value})
  }

  save = () => {
    const {onSubmit, params, dispatch} = this.props

    return dispatch(updateCampaignNameAction, params, this.state.name)
      .then(onSubmit)
  }

  cancel = () => {
    this.props.onSubmit(false)
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              onChange={this.onChange}
              required
              value={this.state.name}
              name='name'
              label='name'/>
          </div>
        </div>

        <div>
          <Button className='mdl-button mdl-button--raised' onClick={this.cancel}>
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

export default EditName
