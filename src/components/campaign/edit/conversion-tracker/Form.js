import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../Input'
import Checkbox from '../../../Checkbox'
import Select from '../../../Select'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import {style} from '../style'
import first from 'lodash/first'
import camelCase from 'lodash/camelCase'
import {createConversionTrackerAction} from '../../../../actions/create-conversion-tracker'

class CreateConversionTracker extends React.Component {
  static displayName = 'Create-Conversion-Tracker'
  static propTypes = {
    dispatch: PropTypes.func,
    categories: PropTypes.array,
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
    name: '',
    exclude_from_bidding: false,
    category: first(this.props.categories),
    ctc_lookback_window: '7',
    viewthrough_lookback_window: '7',
    counting_type: 'MANY_PER_CLICK',
    attribution_model_type: 'LAST_CLICK'
  }

  save = () => {
    const {dispatch, params} = this.props

    return dispatch(
      createConversionTrackerAction,
      params,
      this.state)
      .then(this.props.onSubmit)
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  onChangeExcludeFromBidding = ({target: {checked}}) => {
    this.setState({exclude_from_bidding: !checked})
  }

  render () {
    const {messages} = this.context

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <h5>
              <Message>newConversionTracker</Message>
            </h5>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.name}
              name='name'
              label='name'/>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='category'
              label='conversionCategory'
              value={this.state.category}
              onChange={this.onChange}>
              {map(this.props.categories, (name) =>
                <option key={name} value={name}>
                  {messages[`${camelCase(name)}Conversion`]}
                </option>)}
            </Select>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='ctc_lookback_window'
              label='ctcLookbackWindow'
              value={this.state.ctc_lookback_window}
              onChange={this.onChange}>
              {map(messages.lookbackWindow, (txt, key) =>
                <option key={key} value={key}>
                  {txt}
                </option>)}
            </Select>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='viewthrough_lookback_window'
              label='viewthroughLookbackWindow'
              value={this.state.viewthrough_lookback_window}
              onChange={this.onChange}>
              {map(messages.lookbackWindow, (txt, key) =>
                <option key={key} value={key}>
                  {txt}
                </option>)}
            </Select>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='counting_type'
              label='countingType'
              value={this.state.counting_type}
              onChange={this.onChange}>
              <option value='ONE_PER_CLICK'>{messages.onePerClick}</option>
              <option value='MANY_PER_CLICK'>{messages.manyPerClick}</option>
            </Select>
          </div>
          <div className='mdl-cell mdl-cell--12-col'>
            <Select
              required
              name='attribution_model_type'
              label='attributionModelType'
              value={this.state.attribution_model_type}
              onChange={this.onChange}>
              {map(messages.attributionTypes, (txt, key) =>
                <option key={key} value={key}>
                  {txt}
                </option>)}
            </Select>
            <div className='mdl-cell mdl-cell--12-col'>
              <Checkbox
                required
                name='exclude_from_bidding'
                label={<Message>excludeFromBiddingLabel</Message>}
                checked={!this.state.exclude_from_bidding}
                onChange={this.onChangeExcludeFromBidding}/>
            </div>
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

export default CreateConversionTracker
