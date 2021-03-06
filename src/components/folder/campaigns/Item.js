import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '../../Checkbox'
import {Link} from 'react-router'

export function FolderCampaignLi ({id, name, status, readOnly}, {params}) {
  const campaignUri = `/c/${params.company}/w/${params.workspace}/f/${params.folder}/c/${id}`

  return (
    <li className='mdl-list__item'>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-avatar' title={status.description}>
          {status.icon}
        </i>
        <Link to={campaignUri}>
          {name}
        </Link>
      </span>
      <span className='mdl-list__item-secondary-action'>
        {!readOnly && <Checkbox name={id} value={JSON.stringify(id)}/>}
      </span>
    </li>
  )
}

FolderCampaignLi.displayName = 'Folder-Campaign-Li'
FolderCampaignLi.propTypes = {
  readOnly: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.shape({
    icon: PropTypes.string,
    description: PropTypes.string
  })
}
FolderCampaignLi.contextTypes = {
  params: PropTypes.object
}

export default FolderCampaignLi
