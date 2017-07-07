import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function updateAdGroupProductPartition (campaign, adGroup, partitions, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adGroup/${adGroup}/criteria/product-partition`,
    assign({body: partitions}, config))
}

export function updateAdGroupProductPartitionAction (tree, {campaign, adGroup}, partitions) {
  return updateAdGroupProductPartition(campaign, adGroup, partitions, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
