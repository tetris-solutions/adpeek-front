import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {getDeepCursor} from '../functions/get-deep-cursor'

export function unlinkCampaign (campaign, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/campaign/${campaign}`, config)
}

export function unlinkCampaignAction (tree, company, workspace, folder, campaign) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign]
  ])
  const index = cursor.pop()

  tree.select(cursor).splice([index, 1])
  tree.commit()

  return unlinkCampaign(campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default unlinkCampaignAction
