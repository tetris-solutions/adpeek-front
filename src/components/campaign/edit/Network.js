import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Button, Submit} from '../../Button'
import noop from 'lodash/noop'
import pick from 'lodash/pick'
import map from 'lodash/map'
import omit from 'lodash/omit'
import some from 'lodash/some'
import Checkbox from '../../Checkbox'
import {updateCampaignNetworkAction} from '../../../actions/update-campaign-network'
import {networkNames, networkMessages} from '../adwords/Network'
import forEach from 'lodash/forEach'

const isDisplayCampaign = networks => (
  networks.content_network &&
  !some(omit(networks, 'content_network'))
)

class EditNetwork extends React.Component {
  static displayName = 'Edit-Network'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  static defaultProps = {
    onSubmit: noop
  }

  onSubmit = e => {
    e.preventDefault()

    const {onSubmit, params, dispatch} = this.props
    const network = {}

    forEach(networkNames, name => {
      network[name] = e.target.elements[name].checked
    })

    dispatch(updateCampaignNetworkAction, params, network)
      .then(onSubmit)
  }

  render () {
    const {messages} = this.context
    const {campaign: {details}, onSubmit: close} = this.props
    const networks = pick(details, networkNames)
    const readOnly = isDisplayCampaign(networks)

    return (
      <form onSubmit={this.onSubmit}>
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
          <Button className='mdl-button mdl-button--raised' onClick={close}>
            <Message>cancel</Message>
          </Button>

          <Submit style={{float: 'right'}} className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </form>
    )
  }
}

export default EditNetwork
