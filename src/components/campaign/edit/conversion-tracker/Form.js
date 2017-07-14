import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../Input'
import Checkbox from '../../../Checkbox'
import Radio from '../../../Radio'
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
    attribution_model_type: 'LAST_CLICK',
    $model: 'flexible',
    always_use_default_revenue_value: false,
    default_revenue_value: 1
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

  onChangeRevenueModel = ({target: {value: $model}}) => {
    const changes = {$model}

    switch ($model) {
      case 'fixed':
        changes.always_use_default_revenue_value = true
        changes.default_revenue_value = changes.default_revenue_value || 1
        break
      case 'flexible':
        changes.always_use_default_revenue_value = false
        changes.default_revenue_value = changes.default_revenue_value || 1
        break
      case 'none':
        changes.always_use_default_revenue_value = true
        changes.default_revenue_value = 0
        break
    }

    this.setState(changes)
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
          <div className='mdl-cell mdl-cell--6-col'>
            <Input
              required
              onChange={this.onChange}
              value={this.state.name}
              name='name'
              label='name'/>
          </div>
          <div className='mdl-cell mdl-cell--6-col'>
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
          <div className='mdl-cell mdl-cell--6-col'>
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
          <div className='mdl-cell mdl-cell--6-col'>
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
          <div className='mdl-cell mdl-cell--6-col'>
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
          <div className='mdl-cell mdl-cell--6-col'>
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
          </div>
          <div className='mdl-cell mdl-cell--6-col'>
            <Radio
              name='$model'
              id='fixed-revenue-value'
              checked={this.state.$model === 'fixed'}
              onChange={this.onChangeRevenueModel}
              value='fixed'>
              <Message>fixedRevenueValue</Message>
            </Radio>
            <Radio
              name='$model'
              id='flexible-revenue-value'
              checked={this.state.$model === 'flexible'}
              onChange={this.onChangeRevenueModel}
              value='flexible'>
              <Message>flexibleRevenueValue</Message>
            </Radio>
            <Radio
              name='$model'
              id='no-revenue-value'
              checked={this.state.$model === 'none'}
              onChange={this.onChangeRevenueModel}
              value='none'>
              <Message>noRevenueValue</Message>
            </Radio>
          </div>
          <div className='mdl-cell mdl-cell--6-col'>
            <Checkbox
              required
              name='exclude_from_bidding'
              label={<Message>excludeFromBiddingLabel</Message>}
              checked={!this.state.exclude_from_bidding}
              onChange={this.onChangeExcludeFromBidding}/>

            {this.state.$model !== 'none' && (
              <div style={{marginTop: '1em'}}>
                <Input
                  type='number'
                  format='currency'
                  min={1}
                  name='default_revenue_value'
                  label='defaultRevenueValue'
                  onChange={this.onChange}
                  value={this.state.default_revenue_value}/>
              </div>)}
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
