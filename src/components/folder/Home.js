import get from 'lodash/get'
import React from 'react'
import {node} from '../higher-order/branch'
import {breakOnEmptyProp} from '../higher-order/not-nullable'
import AnalyticsFolder from './Analytics'
import FolderCampaigns from './campaigns/List'

const FolderHome = props => get(props, 'folder.account.platform') === 'analytics'
  ? <AnalyticsFolder {...props}/>
  : <FolderCampaigns {...props}/>

FolderHome.displayName = 'Folder-Home'

export default node('workspace', 'folder', breakOnEmptyProp(FolderHome, 'folder'))
