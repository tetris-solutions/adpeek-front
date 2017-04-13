import get from 'lodash/get'
import React from 'react'
import {node} from '../higher-order/branch'
import AnalyticsFolder from './Analytics'
import FolderCampaigns from './campaigns/List'

export default node('workspace', 'folder',
  props => get(props, 'folder.account.platform') === 'analytics'
    ? <AnalyticsFolder {...props}/>
    : <FolderCampaigns {...props}/>
)
