import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import map from 'lodash/map'
import filter from 'lodash/filter'
import flatten from 'lodash/flatten'

const unwrap = extensions => flatten(map(filter(extensions, {type: 'CALLOUT'}), 'extensions'))

class EditCallOut extends React.Component {
  static displayName = 'Edit-Call-Out'

  static propTypes = {
    campaign: PropTypes.object.isRequired,
    cancel: PropTypes.func.isRequired
  }

  getCampaignCallOutExtensions = () => {
    return map(unwrap(this.props.campaign.details.extension), 'feedItemId')
  }

  state = {
    openCreateModal: false,
    selected: this.getCampaignCallOutExtensions()
  }

  toggleModal = () => {
    this.setState({
      openCreateModal: !this.state.openCreateModal
    })
  }

  save = () => {

  }

  render () {
    const {cancel} = this.props
    const {openCreateModal} = this.state

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-list ${style.list}`}/>
          </div>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={cancel}>
            <Message>cancel</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
            <Message>newCallOut</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>

        {openCreateModal && (
          <Modal onEscPress={this.toggleModal}>
            etc etc etc
          </Modal>)}
      </Form>
    )
  }
}

export default styledComponent(EditCallOut, style)
