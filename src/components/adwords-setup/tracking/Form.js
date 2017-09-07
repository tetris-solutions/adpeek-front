import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import Form from '../../Form'
import Input from '../../Input'
import {Button, Submit} from '../../Button'
import CustomParam from '../../creatives/CustomParam'
import {UrlTracking, cParams} from '../UrlTracking'
import {styledComponent} from '../../higher-order/styled'
import {updateCampaignTrackingAction} from '../../../actions/update-campaign-tracking'
import {updateAccountTrackingAction} from '../../../actions/update-account-tracking'
import {style} from '../../campaign/edit/style'
import map from 'lodash/map'
import values from 'lodash/values'

const actions = {
  campaign: updateCampaignTrackingAction,
  account: updateAccountTrackingAction
}

class TrackingForm extends UrlTracking {
  static displayName = 'Tracking-Form'

  static propTypes = {
    level: PropTypes.oneOf(['account', 'campaign', 'adGroup']),
    close: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    tracking_url: PropTypes.string,
    url_params: PropTypes.shape({
      parameters: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string
      }))
    })
  }

  state = {
    custom_params: cParams(this.props.url_params),
    url_template: this.props.tracking_url || ''
  }

  save = () => {
    const {dispatch, level, params, onSubmit} = this.props

    const payload = {
      custom_params: values(this.state.custom_params),
      url_template: this.state.url_template
    }

    return dispatch(actions[level], params, payload)
      .then(onSubmit)
  }

  render () {
    return (
      <Form onSubmit={this.save} noValidate>
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

        {this.props.level !== 'account' && (
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <h6><Message>urlCustomParameters</Message></h6>
            </div>

            <div className='mdl-cell mdl-cell--12-col'>
              {map(this.state.custom_params, param =>
                <CustomParam
                  key={param.id}
                  param={param}
                  onChange={this.onChange}
                  drop={this.dropCustomParam}/>)}
            </div>

            <div className='mdl-cell mdl-cell--12-col'>
              <Button className='mdl-button' onClick={this.addCustomParam}>
                <Message>newCustomParam</Message>
              </Button>
            </div>
          </div>)}

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--accent' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(TrackingForm, style)
