import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import Create from './Create'
import LocationsTable from './Table'

class EditLocations extends React.PureComponent {
  static displayName = 'Edit-Locations'

  static propTypes = {
    cancel: PropTypes.func,
    reload: PropTypes.func,
    campaign: PropTypes.object,
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

  save = () => {

  }

  render () {
    const {locations} = this.props.campaign.details

    return (
      <Form onSubmit={this.save}>
        <div className={style.list}>
          <LocationsTable locations={locations}/>
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
          <Modal size='small'>
            <Create
              {...this.props}
              cancel={this.toggleModal}
              onSubmit={this.onCreate}/>
          </Modal>)}
      </Form>
    )
  }
}

export default styledComponent(EditLocations, style)
