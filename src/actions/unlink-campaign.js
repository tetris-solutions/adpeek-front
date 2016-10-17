import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

function unlinkCampaigns (folder, campaigns, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/folder/${folder}/campaigns`,
    assign({body: campaigns}, config))
}

export function unlinkCampaignsAction (tree, company, workspace, folder, campaigns) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    'campaigns'
  ])

  const remainingCampaigns = filter(tree.get(cursor), ({id}) => !includes(campaigns, id))
  tree.set(cursor, remainingCampaigns)
  tree.commit()

  return unlinkCampaigns(folder, campaigns, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

