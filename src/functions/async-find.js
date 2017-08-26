import 'setimmediate'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import matchesProperty from 'lodash/matchesProperty'
import matches from 'lodash/matches'

export const asyncFind = (array, matcher, value = undefined, batchSize = 500) => new Promise((resolve, reject) => {
  let offset = 0

  if (isPlainObject(matcher)) {
    matcher = matches(matcher)
  } else if (isString(matcher)) {
    matcher = matchesProperty(matcher, value)
  }

  function search () {
    let i

    for (i = 0; i < 500 && array[i + offset]; i++) {
      const item = array[i + offset]
      if (matcher(item)) {
        resolve(item)
        return
      }
    }

    offset += i

    if (array[offset]) {
      setImmediate(search)
    } else {
      reject(-1)
    }
  }

  return search()
})
