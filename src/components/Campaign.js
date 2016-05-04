import React from 'react'
import Checkbox from './Checkbox'
import {getStatusIcon} from '../functions/get-status-icon'

const {PropTypes} = React

export function Campaign ({id, name, status, sub_status}) {
  return (
    <li className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar' title={status}>
          {getStatusIcon(status, sub_status)}
        </i>
        {name}
      </span>
      <span className='mdl-list__item-secondary-action'>
        <Checkbox name={id} value={JSON.stringify(id)}/>
      </span>
    </li>
  )
}

Campaign.displayName = 'Campaign'
Campaign.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.string,
  sub_status: PropTypes.string
}

export default Campaign
