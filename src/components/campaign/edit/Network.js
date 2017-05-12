import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Button, Submit} from '../../Button'
import noop from 'lodash/noop'
import pick from 'lodash/pick'
import map from 'lodash/map'
import Checkbox from '../../Checkbox'
import {networkNames, networkMessages} from '../adwords/Network'

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
  }

  render () {
    const {messages} = this.context
    const {campaign: {details}, onSubmit: close} = this.props

    return (
      <form onSubmit={this.onSubmit}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            {map(pick(details, networkNames), (checked, name) =>
              <Checkbox
                key={name}
                name={name}
                label={messages[networkMessages[name]]}
                disabled={checked}
                checked={checked}/>)}
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
