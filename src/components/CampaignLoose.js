import React from 'react'
import Checkbox from './Checkbox'
import {getStatusIcon} from '../functions/get-status-icon'

const {PropTypes} = React

export function CampaignLoose ({external_id, name, status, sub_status, platform}) {
  const serialized = JSON.stringify({name, external_id, status, sub_status, platform})
  return (
    <li className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar' title={status}>
          {getStatusIcon(status, sub_status)}
        </i>
        {name}
      </span>
      <span className='mdl-list__item-secondary-action'>
        <Checkbox name={external_id} value={serialized}/>
      </span>
    </li>
  )
}

CampaignLoose.displayName = 'Campaign-Loose'
CampaignLoose.propTypes = {
  platform: PropTypes.string,
  external_id: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.string,
  sub_status: PropTypes.string
}
export default CampaignLoose
