import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import Message from '@tetris/front-server/Message'
import {Button} from '../../../Button'
import {style} from '../../../campaign/edit/style'
import {styledComponent} from '../../../higher-order/styled'
import Create from './Create'
import LocationsTable from './Table'

class EditLocations extends React.PureComponent {
  static displayName = 'Edit-Locations'

  static propTypes = {
    cancel: PropTypes.func,
    reload: PropTypes.func,
    account: PropTypes.object,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    openModal: false
  }

  toggleModal = () => {
    this.setState({openModal: !this.state.openModal})
  }

  onCreate = () => {
    return this.props.reload()
      .then(this.toggleModal)
  }

  render () {
    const {locations} = this.props.account.details

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={style.list}>
              <LocationsTable locations={locations}/>
            </div>
          </div>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>close</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
            <Message>newLocation</Message>
          </Button>
        </div>
        {this.state.openModal && (
          <Modal size='small' onEscPress={this.toggleModal}>
            <Create
              {...this.props}
              cancel={this.toggleModal}
              onSubmit={this.onCreate}/>
          </Modal>)}
      </div>
    )
  }
}

export default styledComponent(EditLocations, style)
