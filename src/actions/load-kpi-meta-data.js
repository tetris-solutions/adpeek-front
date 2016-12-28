import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

export function loadKPIMetadata (kpi, platform, config) {
  return GET(`${process.env.ADPEEK_API_URL}/kpi/${kpi}/platform/${platform}/metadata`, config)
}

export function loadKPIMetadataAction (tree, kpi, platform, token) {
  return loadKPIMetadata(kpi, platform, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.set(['kpi', kpi, platform], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
