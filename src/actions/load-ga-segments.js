import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadGASegments (company, tetris_account, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${company}/account/${tetris_account}/segments`, config)
}

export function loadGASegmentsAction (tree, {company, workspace}, {tetris_id}) {
  return loadGASegments(company, tetris_id, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      'accounts',
      'analytics',
      'segments'
    ]))
    .catch(pushResponseErrorToState(tree))
}
