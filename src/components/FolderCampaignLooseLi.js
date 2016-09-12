import React from 'react'
import Checkbox from './Checkbox'
import TextMessage from 'intl-messageformat'
import {Link} from 'react-router'
const {PropTypes} = React

export function FolderCampaignLooseLi ({external_id, name, status, platform, is_adwords_video, folder}, {locales, messages, params}) {
  const serialized = JSON.stringify({
    name,
    external_id,
    is_adwords_video,
    status: status.status,
    sub_status: status.sub_status,
    platform
  })

  if (folder) {
    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar' title={messages.takenCampaign}>
            not_interested
          </i>
          {name}
        </span>
        <Link
          className='mdl-list__item-secondary-action'
          title={new TextMessage(messages.openFolderName, locales).format({name: folder.name})}
          to={`/company/${params.company}/workspace/${params.workspace}/folder/${folder.id}`}>
          <i className='material-icons'>
            folder_open
          </i>
        </Link>
      </li>
    )
  }

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
FolderCampaignLooseLi.contextTypes = {
  params: PropTypes.object,
  messages: PropTypes.object,
  locales: PropTypes.string
}
FolderCampaignLooseLi.propTypes = {
  platform: PropTypes.string,
  external_id: PropTypes.string,
  name: PropTypes.string,
  is_adwords_video: PropTypes.bool,
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  status: PropTypes.shape({
    icon: PropTypes.string,
    description: PropTypes.string
  })
}
export default FolderCampaignLooseLi
