import React from 'react'
import PropTypes from 'prop-types'
import Creatives from '../creatives/Creatives'

const FolderCreatives = ({folder, children, dispatch, params, cursors}) => (
  <Creatives
    dispatch={dispatch}
    params={params}
    folder={folder}
    getAdGroupsWithRelevance={() => cursors.folder.adGroups}
    adGroups={folder.adGroups}
    platform={folder.account.platform}>
    {children}
  </Creatives>
)

FolderCreatives.displayName = 'Folder-Creatives'
FolderCreatives.propTypes = {
  cursors: PropTypes.object,
  folder: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
  children: PropTypes.node
}

export default FolderCreatives
