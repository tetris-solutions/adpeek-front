import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
// import {Tabs, Tab} from '../../../Tabs'
import LocationsTable from './Table'

class EditLocations extends React.PureComponent {
  static displayName = 'Edit-Locations'

  static propTypes = {
    cancel: PropTypes.func,
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
            <Message>cancel</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
            <Message>newLocation</Message>
          </Button>
          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditLocations, style)
