import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

export function linkCampaign (folder, campaign, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/campaign`,
    assign({body: campaign}, config))
}

export function linkCampaignAction (tree, company, workspace, folder, campaign) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['looseCampaigns', campaign.external_id, 'external_id']
  ])
  const index = cursor.pop()

  tree.select(cursor).splice([index, 1])
  tree.commit()

  return linkCampaign(folder, campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default linkCampaignAction
