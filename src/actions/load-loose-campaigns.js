import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveCampaigns} from '../functions/save-campaigns'

export function loadLooseCampaigns (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}/campaigns/loose`, config)
}

export function loadLooseCampaignsAction (tree, company, workspace, folder, token) {
  return loadLooseCampaigns(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveCampaigns(tree, company, workspace, folder, 'looseCampaigns'))
    .catch(pushResponseErrorToState(tree))
}

export function loadLooseCampaignsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res) {
  return loadLooseCampaignsAction(res.locals.tree, company, workspace, folder, authToken)
}

export function loadLooseCampaignsActionRouterAdaptor ({params: {company, workspace, folder}}, tree) {
  return loadLooseCampaignsAction(tree, company, workspace, folder)
}
