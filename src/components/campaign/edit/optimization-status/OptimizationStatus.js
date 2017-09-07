import React from 'react'
import Message from '@tetris/front-server/Message'
import PropTypes from 'prop-types'
import {Submit, Button} from '../../../Button'
import Form from '../../../Form'
import {updateCampaignOptimizationStatusAction} from '../../../../actions/update-campaign-optimization-status'
import map from 'lodash/map'
import camelCase from 'lodash/camelCase'
import Radio from '../../../Radio'

const options = [
  'OPTIMIZE',
  'CONVERSION_OPTIMIZE',
  'ROTATE',
  'ROTATE_INDEFINITELY'
]

class EditOptimizationStatus extends React.Component {
  static displayName = 'Edit-Optimization-Status'

  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    onSubmit: PropTypes.func,
    cancel: PropTypes.func
  }

  state = {
    selected: this.props.campaign.details.optimization_status
  }

  onChange = ({target: {value: selected}}) => {
    this.setState({selected})
  }

  save = () => {
    const {onSubmit, params, dispatch} = this.props

    return dispatch(updateCampaignOptimizationStatusAction, params, this.state.selected)
      .then(onSubmit)
  }

  render () {
    const {selected} = this.state

    return (
      <Form onSubmit={this.save}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>{map(options, name =>
            <div key={name}>
              <Radio name={name} id={name} value={name} onChange={this.onChange} checked={selected === name}>
                <Message className='mdl-radio__label'>
                  {camelCase(name) + 'StatusLabel'}
                </Message>
              </Radio>
            </div>)}
          </div>
        </div>

        <div>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit style={{float: 'right'}} className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default EditOptimizationStatus
