import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderChannel (folder, channel, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/channel/${channel}`, config)
}

export function loadFolderChannelAction (tree, {company, workspace, folder}, channel) {
  return loadFolderChannel(folder, channel, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      'channels',
      channel
    ]))
    .catch(pushResponseErrorToState)
}
