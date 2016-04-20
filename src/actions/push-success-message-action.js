/**
 * pushes a success alert to the state tree
 * @param {Baobab} tree state tree
 * @param {String} [message] predefined message
 * @returns {undefined}
 */
export function pushSuccessMessageAction (tree, message) {
  message = message || tree.get(['intl', 'messages', 'onSuccessAlert'])
  tree.push('alerts', {
    level: 'success',
    message
  })
}

export default pushSuccessMessageAction
