import React from 'react'
import Checkbox from './Checkbox'
import {getStatusIcon} from '../functions/get-status-icon'

const {PropTypes} = React

const CampaignLoose = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    unlinkCampaign: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    sub_status: PropTypes.string
  },
  unlink () {
    setTimeout(() => this.props.unlinkCampaign(this.props.id), 300)
  },
  render () {
    const {id, name, status, sub_status} = this.props
    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar' title={status}>
            {getStatusIcon(status, sub_status)}
          </i>
          {name}
        </span>
        <span className='mdl-list__item-secondary-action'>
          <Checkbox name={id} onChange={this.unlink} checked/>
        </span>
      </li>
    )
  }
})

export default CampaignLoose
