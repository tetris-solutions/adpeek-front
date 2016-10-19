import startsWith from 'lodash/startsWith'

/**
 * @param {String} string full text
 * @param {String} target fragment to be removed
 * @return {String} clean string
 */
export const removeFromStart =
  (string, target) =>
    startsWith(string, target)
      ? string.substr(target.length)
      : string
