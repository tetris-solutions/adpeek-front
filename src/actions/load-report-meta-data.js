import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import omit from 'lodash/omit'
import without from 'lodash/without'
import set from 'lodash/set'

function loadReportMetaData (platform, entity, config) {
  return GET(`${process.env.NUMBERS_API_URL}/meta?platform=${platform}&entity=${entity}`, config)
}

const excluded = [
  'name',
  'date_stop'
]

export function loadReportMetaDataAction (tree, platform, entity, token) {
  return loadReportMetaData(platform, entity, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const metaData = response.data
      const entityNameMessage = `${entity.toLowerCase()}Entity`

      metaData.attributes = omit(metaData.attributes, excluded)

      set(metaData, 'attributes.id.name',
        tree.get(['intl', 'messages', entityNameMessage]))

      metaData.dimensions = without(metaData.dimensions, excluded)

      tree.set(['reports', 'metaData', platform, entity], metaData)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
