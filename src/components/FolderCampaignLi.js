import React from 'react'
import Checkbox from './Checkbox'
import {Link} from 'react-router'

export function FolderCampaignLi ({id, name, status, readOnly}, {params}) {
  const campaignUri = `/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/campaign/${id}/creatives`

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
  readOnly: React.PropTypes.bool,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  status: React.PropTypes.shape({
    icon: React.PropTypes.string,
    description: React.PropTypes.string
  })
}
FolderCampaignLi.contextTypes = {
  params: React.PropTypes.object
}

export default FolderCampaignLi
