import isArray from 'lodash/isArray'
import map from 'lodash/map'
import find from 'lodash/find'
import assign from 'lodash/assign'
import isObject from 'lodash/isObject'

export function mergeResponseArray (after, before) {
  if (!(isArray(before) && isArray(after))) return after

  return map(after, item =>
    isObject(item) && item.id
      ? assign({}, find(before, {id: item.id}), item)
      : item)
}
