import React from 'react'
import get from 'lodash/get'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import startsWith from 'lodash/startsWith'
import forEach from 'lodash/forEach'

export default {
  contextTypes: {
    router: React.PropTypes.object,
    messages: React.PropTypes.object
  },
  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      name: get(this.props, 'workspace.name', '')
    }
  },
  /**
   * @param {Object} data workspace object
   * @param {Function} action action that will be dispatched
   * @return {Promise} promise that resolves once action is complete
   */
  saveWorkspace (data, action) {
    const {dispatch, params: {company, workspace}} = this.props

    this.preSubmit()

    return dispatch(action, company, data)
      .then(response => {
        this.context.router.push(`/company/${company}/workspace/${workspace || response.data.id}`)
      })
      .then(() => dispatch(pushSuccessMessageAction))
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  /**
   * serialize workspace <form>
   * @param {HTMLFormElement} form form DOM element
   * @returns {{name: *, accounts: {facebook, adwords, analytics}, roles: Array}} workspace object
   */
  serializeWorkspaceForm (form) {
    const {elements} = form
    const data = {
      name: elements.name.value,
      accounts: {
        facebook: JSON.parse(elements.facebook_account.value),
        adwords: JSON.parse(elements.adwords_account.value),
        analytics: JSON.parse(elements.analytics_account.value)
      },
      roles: []
    }

    forEach(elements, ({type, name, checked}) => {
      const prefix = 'role_'

      if (type === 'checkbox' && startsWith(name, prefix) && checked) {
        data.roles.push(name.substr(prefix.length))
      }
    })

    return data
  }
}
