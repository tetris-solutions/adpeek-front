import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Button, Submit} from '../../../Button'
import Form from '../../../Form'
import pick from 'lodash/pick'
import map from 'lodash/map'
import Checkbox from '../../../Checkbox'
import {updateCampaignNetworkAction} from '../../../../actions/update-campaign-network'
import {networkNames, networkMessages} from '../../adwords/Network'
import forEach from 'lodash/forEach'

class EditNetwork extends React.Component {
  static displayName = 'Edit-Network'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  save = e => {
    const {onSubmit, params, dispatch} = this.props
    const network = {}

    forEach(networkNames, name => {
      network[name] = e.target.elements[name].checked
    })

    return dispatch(updateCampaignNetworkAction, params, network)
      .then(onSubmit)
  }

  render () {
    const {messages} = this.context
    const {campaign, cancel} = this.props
    const networks = pick(campaign.details, networkNames)
    const readOnly = campaign.details.channel === 'DISPLAY'

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            {map(networks, (enabledForCampaign, name) =>
              <Checkbox
                key={name}
                name={name}
                label={messages[networkMessages[name]]}
                disabled={readOnly || enabledForCampaign}
                checked={enabledForCampaign}/>)}
          </div>
        </div>

        <div>
          <Button className='mdl-button mdl-button--raised' onClick={cancel}>
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

export default EditNetwork
