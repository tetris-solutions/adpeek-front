import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'

function loadBundlePreviewUrl (folder, bundle, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/bundle/${bundle}`, config)
}

const register = {}

export function loadBundlePreviewUrlAction (tree, {company, workspace, folder, campaign}, adGroupId, adId, bundleId) {
  register[bundleId] = register[bundleId] || loadBundlePreviewUrl(folder, bundleId, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .catch(pushResponseErrorToState(tree))

  return register[bundleId]
    .then(saveResponseData(tree, compact([
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      campaign && ['campaigns', campaign],
      ['adGroups', adGroupId],
      ['ads', adId],
      'preview'
    ])))
}
