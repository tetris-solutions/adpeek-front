import startsWith from 'lodash/startsWith'

/**
 * serialize workspace <form>
 * @param {HTMLFormElement} form form DOM element
 * @returns {{name: *, accounts: {facebook, adwords}, roles: Array}} workspace object
 */
export function serializeWorkspaceForm (form) {
  const {elements} = form
  const data = {
    name: elements.name.value,
    dash_campaign: elements.dash_campaign.value,
    accounts: {
      facebook: JSON.parse(elements.facebook_account.value),
      adwords: JSON.parse(elements.adwords_account.value)
    },
    roles: []
  }

  Object.keys(elements)
    .forEach(name => {
      const prefix = 'role_'
      if (startsWith(name, prefix) && elements[name].checked) {
        data.roles.push(name.substr(prefix.length))
      }
    })

  return data
}
