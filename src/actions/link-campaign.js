import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
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
