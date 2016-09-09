import React from 'react'
import Checkbox from './Checkbox'

const {PropTypes} = React

export function FolderCampaignLooseLi ({external_id, name, status, platform, is_adwords_video}) {
  const serialized = JSON.stringify({
    name,
    external_id,
    is_adwords_video,
    status: status.status,
    sub_status: status.sub_status,
    platform
  })

  return (
    <li className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar' title={status.description}>
          {status.icon}
        </i>
        {name}
      </span>
      <span className='mdl-list__item-secondary-action'>
        <Checkbox name={external_id} value={serialized}/>
      </span>
    </li>
  )
}

FolderCampaignLooseLi.displayName = 'Loose-Campaign'
FolderCampaignLooseLi.defaultProps = {
  is_adwords_video: false
}
FolderCampaignLooseLi.propTypes = {
  platform: PropTypes.string,
  external_id: PropTypes.string,
  name: PropTypes.string,
  is_adwords_video: PropTypes.bool,
  status: PropTypes.shape({
    icon: PropTypes.string,
    description: PropTypes.string
  })
}
export default FolderCampaignLooseLi
