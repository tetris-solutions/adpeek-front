import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import map from 'lodash/map'
import includes from 'lodash/includes'
import filter from 'lodash/filter'

function linkCampaigns (folder, campaigns, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/campaigns`,
    assign({body: campaigns}, config))
}

export function linkCampaignsAction (tree, company, workspace, folder, campaigns) {
  const campaignsCursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    'looseCampaigns'
  ])

  const externalIds = map(campaigns, 'external_id')
  const withoutLinkedCampaigns = filter(tree.get(campaignsCursor), ({external_id}) => !includes(externalIds, external_id))

  tree.set(campaignsCursor, withoutLinkedCampaigns)
  tree.commit()

  return linkCampaigns(folder, campaigns, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
