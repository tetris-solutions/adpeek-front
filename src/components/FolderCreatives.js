import React from 'react'
import Creatives from './Creatives'

const FolderCreatives = ({folder, dispatch, params, cursors}) => (
  <Creatives
    dispatch={dispatch}
    params={params}
    adGroupsWithRelevance={() => cursors.folder.adGroups}
    adGroups={folder.adGroups}
    platform={folder.account.platform}/>
)

FolderCreatives.displayName = 'Folder-Creatives'
FolderCreatives.propTypes = {
  cursors: React.PropTypes.object,
  folder: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object
}

export default FolderCreatives
