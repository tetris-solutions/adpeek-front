import {PropTypes} from 'react'
import get from 'lodash/get'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import startsWith from 'lodash/startsWith'
import forEach from 'lodash/forEach'

export default {
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object
  },
  propTypes: {
    params: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      name: get(this.props, 'workspace.name', '')
    }
  },
  /**
   * @param {Object} data workspace object
   * @param {Function} action action that will be dispatched
   * @param {String} redirectUrl final url
   * @return {Promise} promise that resolves once action is complete
   */
  saveWorkspace (data, action, redirectUrl) {
    const {dispatch, params: {company}} = this.props

    this.preSubmit()

    return dispatch(action, company, data)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => this.context.router.push(redirectUrl))
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  /**
   * serialize workspace <form>
   * @param {HTMLFormElement} form form DOM element
   * @returns {{name: *, accounts: {facebook, adwords}, roles: Array}} workspace object
   */
  serializeWorkspaceForm (form) {
    const {elements} = form
    const data = {
      name: elements.name.value,
      accounts: {
        facebook: JSON.parse(elements.facebook_account.value),
        adwords: JSON.parse(elements.adwords_account.value)
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
