import React from 'react'
import Creatives from './Creatives'

const FolderCreatives = ({folder, dispatch, params}) => (
  <Creatives
    dispatch={dispatch}
    params={params}
    adGroups={folder.adGroups}
    platform={folder.account.platform}/>
)

FolderCreatives.displayName = 'Folder-Creatives'
FolderCreatives.propTypes = {
  folder: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object
}

export default FolderCreatives
