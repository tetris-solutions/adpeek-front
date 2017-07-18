import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../Input'
import Select from '../../../Select'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import {style} from '../../../campaign/edit/style'
import first from 'lodash/first'
import {createLocationFeedItemAction} from '../../../../actions/create-location'

class CreateLocation extends React.Component {
  static displayName = 'Create-Location'
  static propTypes = {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      details: PropTypes.shape({
        locationFeeds: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string
        }))
      })
    }),
    params: PropTypes.object,
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    businessName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    countryCode: 'BR',
    postalCode: '',
    phoneNumber: ''
  }

  save = () => {
    const {dispatch, params, campaign} = this.props

    return dispatch(
      createLocationFeedItemAction,
      params,
      first(campaign.details.locationFeeds).id,
      this.state)
      .then(this.props.onSubmit)
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  render () {
    const {messages} = this.context

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>
              <Message>newLocation</Message>
            </h5>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.businessName}
              name='businessName'
              label='businessName'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.addressLine1}
              name='addressLine1'
              label='addressLine1'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              onChange={this.onChange}
              value={this.state.addressLine2}
              name='addressLine2'
              label='addressLine2'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.city}
              name='city'
              label='city'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.province}
              name='province'
              label='province'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='countryCode'
              label='countryCode'
              value={this.state.countryCode}
              onChange={this.onChange}>
              {map(messages.salesCountries, (name, code) =>
                <option key={code} value={code}>{name}</option>)}
            </Select>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.postalCode}
              name='postalCode'
              label='postalCode'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.phoneNumber}
              name='phoneNumber'
              label='phoneNumber'/>
          </div>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default CreateLocation
