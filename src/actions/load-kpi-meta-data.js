import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import merge from 'lodash/merge'

function loadKPIMetadata (kpi, platform, config) {
  return GET(`${process.env.ADPEEK_API_URL}/kpi/${kpi}/platform/${platform}/metadata`, config)
}

export function loadKPIMetadataAction (tree, kpi, platform, token) {
  return loadKPIMetadata(kpi, platform, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.set('kpis', merge({}, tree.get('kpis'), {
        [platform]: {
          [kpi]: response.data
        }
      }))

      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
