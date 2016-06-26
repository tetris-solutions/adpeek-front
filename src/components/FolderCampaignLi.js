import React from 'react'
import Checkbox from './Checkbox'
import {Link} from 'react-router'

const {PropTypes} = React

export function FolderCampaignLi ({id, name, status}, {params}) {
  const campaignUri = `/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/campaign/${id}`

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
        <Checkbox name={id} value={JSON.stringify(id)}/>
      </span>
    </li>
  )
}

FolderCampaignLi.displayName = 'Campaign-Li'
FolderCampaignLi.propTypes = {
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