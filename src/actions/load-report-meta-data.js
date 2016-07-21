import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function loadReportMetaData (platform, entity, config) {
  return GET(`${process.env.NUMBERS_API_URL}/meta?platform=${platform}&entity=${entity}`, config)
}

export function loadReportMetaDataAction (tree, platform, entity, token) {
  return loadReportMetaData(platform, entity, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.set(['reports', 'metaData', platform, entity], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
