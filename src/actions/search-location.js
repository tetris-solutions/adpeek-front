import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function searchLocation (term, config) {
  return GET(`${process.env.ADPEEK_API_URL}/search-location?term=${term}`, config)
}

export function searchLocationAction (tree, term) {
  return searchLocation(term, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
