import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import {Button} from '../Button'
import capitalize from 'lodash/capitalize'
import {loadAdGroupDetailsAction} from '../../actions/load-adgroup-details'
import {styledComponent} from '../higher-order/styled'
import AdGroupDetails from './AdGroupDetails'
import Input from '../Input'
import map from 'lodash/map'
import concat from 'lodash/concat'
import set from 'lodash/set'
import csjs from 'csjs'
import get from 'lodash/get'

const style = csjs`
.title {
  text-align: center;
  margin-bottom: 2em;
}
.actions button:last-child {
  float: right;  
}`

class AdGroupEdit extends React.Component {
  static displayName = 'Ad-Group-Edit'

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
    details: PropTypes.object,
    name: PropTypes.string,
    status: PropTypes.string,
    onChange: PropTypes.func,
    close: PropTypes.func,
    custom_params: PropTypes.array,
    url_template: PropTypes.string
  }

  state = {
    status: this.props.status,
    custom_params: concat(get(this.props, 'custom_params.parameters', [])),
    url_template: this.props.url_template || ''
  }

  componentDidMount () {
    this.loadDetails()
  }

  loadDetails = (fresh = false) => {
    const {dispatch, params} = this.props

    return dispatch(loadAdGroupDetailsAction, params, fresh)
  }

  reload = () => {
    return this.loadDetails(true)
  }

  write = (name, value) => {
    this.props.onChange({target: {name, value}})
  }

  save = () => {
    this.write('status', this.state.status)
    this.write('url_template', this.state.url_template)
    this.write('custom_params', this.state.custom_params)
    this.props.close()
  }

  onChange = ({target: {name, value}}) => {
    this.setState(set(this.state, name, value))
  }

  addCustomParam = () => {
    this.setState({
      custom_params: concat(
        this.state.custom_params,
        {key: '', value: ''}
      )
    })
  }

  render () {
    return (
      <div>
        <div className='mdl-grid'>
          <div className={`mdl-cell mdl-cell--12-col ${style.title}`}>
            <h5>{this.props.name}</h5>
          </div>

          <div className='mdl-cell mdl-cell--6-col'>
            <Select label='adGroupStatus' name='status' value={this.state.status} onChange={this.onChange}>
              <option value='ENABLED'>
                {capitalize('ENABLED')}
              </option>

              <option value='PAUSED'>
                {capitalize('PAUSED')}
              </option>

              <option value='REMOVED'>
                {capitalize('REMOVED')}
              </option>
            </Select>

            {this.props.details
              ? <AdGroupDetails {...this.props} {...this.props.details} reload={this.reload}/>
              : <p><Message>loadingAdGroupDetails</Message></p>}
          </div>

          <div className='mdl-cell mdl-cell--6-col'>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <Input
                  name='url_template'
                  label='trackingUrlTemplate'
                  type='url'
                  value={this.state.url_template}
                  onChange={this.onChange}/>
              </div>
            </div>

            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                <h6><Message>urlCustomParameters</Message></h6>
              </div>
            </div>

            {map(this.state.custom_params, ({key, value}, index) => (
              <div key={index} className='mdl-grid'>
                <div className='mdl-cell mdl-cell--5-col'>
                  <Input
                    name={`custom_params.${index}.key`}
                    label='urlCustomParameterKey'
                    value={key}
                    onChange={this.onChange}/>
                </div>
                <div className='mdl-cell mdl-cell--7-col'>
                  <Input
                    name={`custom_params.${index}.value`}
                    label='urlCustomParameterValue'
                    value={value}
                    onChange={this.onChange}/>
                </div>
              </div>))}

            <p className={style.actions}>
              <Button className='mdl-button' onClick={this.addCustomParam}>
                <Message>newCustomParam</Message>
              </Button>
            </p>
          </div>

          <div className={`mdl-cell mdl-cell--12-col ${style.actions}`}>
            <hr/>

            <Button className='mdl-button mdl-button--accent' onClick={this.props.close}>
              <Message>cancel</Message>
            </Button>

            <Button className='mdl-button' onClick={this.save}>
              <Message>save</Message>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default styledComponent(AdGroupEdit, style)
