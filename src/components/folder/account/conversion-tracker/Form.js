import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../Input'
import Checkbox from '../../../Checkbox'
import Radio from '../../../Radio'
import Select from '../../../Select'
import sortBy from 'lodash/sortBy'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import {style} from '../../../campaign/edit/style'
import first from 'lodash/first'
import camelCase from 'lodash/camelCase'
import {createConversionTrackerAction} from '../../../../actions/create-conversion-tracker'
import assign from 'lodash/assign'

class CreateConversionTracker extends React.Component {
  static displayName = 'Create-Conversion-Tracker'
  static propTypes = {
    dispatch: PropTypes.func,
    ConversionTrackerType: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    modes: PropTypes.arrayOf(PropTypes.string),
    ctc_lookback_window: PropTypes.number,
    viewthrough_lookback_window: PropTypes.number,
    counting_type: PropTypes.string,
    attribution_model_type: PropTypes.string,
    app_platform: PropTypes.string,
    app_conversion_type: PropTypes.string,
    params: PropTypes.object,
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  static defaultProps = {
    ctc_lookback_window: 30,
    viewthrough_lookback_window: 1,
    modes: ['flexible', 'fixed', 'none'],
    categories: ['DEFAULT', 'PAGE_VIEW', 'PURCHASE', 'SIGNUP', 'LEAD'],
    counting_type: 'MANY_PER_CLICK',
    attribution_model_type: 'LAST_CLICK'
  }

  // appConversion + install: hide flexible mode
  // appConversion + purchase: hide mode and revenue options; set default revenue to 0
  state = {
    name: '',
    ConversionTrackerType: this.props.ConversionTrackerType,
    exclude_from_bidding: false,
    category: first(this.props.categories),
    ctc_lookback_window: String(this.props.ctc_lookback_window),
    viewthrough_lookback_window: String(this.props.viewthrough_lookback_window),
    counting_type: this.props.counting_type,
    attribution_model_type: this.props.attribution_model_type,
    mode: first(this.props.modes),
    always_use_default_revenue_value: false,
    default_revenue_currency_code: 'BRL',
    default_revenue_value: 1,
    phone_call_duration: 60,
    app_platform: this.props.app_platform,
    app_conversion_type: this.props.app_conversion_type,
    app_id: '',
    app_postback_url: ''
  }

  save = () => {
    const {dispatch, params} = this.props
    const payload = assign({}, this.state)

    if (payload.category === 'DOWNLOAD') {
      payload.counting_type = 'ONE_PER_CLICK'
    }

    return dispatch(
      createConversionTrackerAction,
      params,
      payload)
      .then(this.props.onSubmit)
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  onChangeExcludeFromBidding = ({target: {checked}}) => {
    this.setState({exclude_from_bidding: !checked})
  }

  onChangeRevenueModel = ({target: {value: mode}}) => {
    const changes = {mode}

    switch (mode) {
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
    const {ConversionTrackerType, category} = this.state
    const isCall = (
      ConversionTrackerType === 'AdCallMetricsConversion' ||
      ConversionTrackerType === 'WebsiteCallMetricsConversion'
    )
    const isApp = ConversionTrackerType === 'AppConversion'
    const isDownload = category === 'DOWNLOAD'
    const {messages} = this.context
    const categories = sortBy(map(this.props.categories, value => ({
      text: messages[`${camelCase(value)}Conversion`],
      value
    })), 'text')

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

          {isApp && (
            <div className='mdl-cell mdl-cell--6-col'>
              <Input
                required
                onChange={this.onChange}
                value={this.state.app_id}
                name='app_id'
                label='appId'/>
            </div>)}

          <div className='mdl-cell mdl-cell--6-col'>
            <Select
              required
              name='category'
              label='conversionCategory'
              value={this.state.category}
              onChange={this.onChange}>
              {map(categories, ({text, value}) =>
                <option key={value} value={value}>
                  {text}
                </option>)}
            </Select>
          </div>

          {isCall && (
            <div className='mdl-cell mdl-cell--6-col'>
              <Input
                required
                type='number'
                onChange={this.onChange}
                value={this.state.phone_call_duration}
                name='phone_call_duration'
                label='phoneCallDuration'/>

              <br/>
              <small>
                <em>
                  <Message>phoneCallDurationDescription</Message>
                </em>
              </small>
            </div>)}

          {!(isApp && isDownload) && (
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
            </div>)}

          {ConversionTrackerType === 'AdWordsConversionTracker' && (
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
            </div>)}

          {!(isApp && isDownload) && (
            <div className='mdl-cell mdl-cell--6-col'>
              <Select
                required
                name='counting_type'
                label='countingType'
                value={this.state.counting_type}
                onChange={this.onChange}>
                <option value='ONE_PER_CLICK'>
                  {messages.onePerClick}
                </option>
                <option value='MANY_PER_CLICK'>
                  {messages.manyPerClick}
                </option>
              </Select>
            </div>)}

          {!isApp && (
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
            </div>)}

          <div className='mdl-cell mdl-cell--6-col'>
            {map(this.props.modes, mode => (
              <Radio
                key={mode}
                name='mode'
                id={`${mode}-revenue-value`}
                checked={this.state.mode === mode}
                onChange={this.onChangeRevenueModel}
                value={mode}>
                <Message>{`${mode}RevenueValue`}</Message>
              </Radio>))}
          </div>

          <div className='mdl-cell mdl-cell--6-col'>
            <Checkbox
              required
              name='exclude_from_bidding'
              label={<Message>excludeFromBiddingLabel</Message>}
              checked={!this.state.exclude_from_bidding}
              onChange={this.onChangeExcludeFromBidding}/>

            {this.state.mode !== 'none' && (
              <div style={{marginTop: '1em'}}>
                <Select
                  label='currencyCode'
                  name='default_revenue_currency_code'
                  value={this.state.default_revenue_currency_code}
                  onChange={this.onChange}>
                  <option value='BRL'>BRL, Real, (R$)</option>
                  <option value='USD'>USD, US Dollar ($)</option>
                </Select>
                <Input
                  type='number'
                  format='currency'
                  currency={this.state.default_revenue_currency_code}
                  min={1}
                  name='default_revenue_value'
                  label='defaultRevenueValue'
                  onChange={this.onChange}
                  value={this.state.default_revenue_value}/>
              </div>)}
          </div>

          {isApp && (
            <div className='mdl-cell mdl-cell--6-col'>
              <Input
                type='url'
                onChange={this.onChange}
                value={this.state.app_postback_url}
                name='app_postback_url'
                label='appPostbackUrl'/>

              <br/>
              <small>
                <em>
                  <Message html>appPostbackUrlDescription</Message>
                </em>
              </small>
            </div>)}
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
