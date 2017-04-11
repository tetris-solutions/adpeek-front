import PropTypes from 'prop-types'
import get from 'lodash/get'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import startsWith from 'lodash/startsWith'
import forEach from 'lodash/forEach'
import assign from 'lodash/assign'
import {loadGAPropertiesAction} from '../../actions/load-ga-properties'
import {loadGAViewsAction} from '../../actions/load-ga-views'

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

    const {gaProperty, gaView} = this.state

    if (gaProperty) {
      assign(data.accounts.analytics, {
        ga_property_id: gaProperty.id,
        ga_property_name: gaProperty.name
      })
    }

    if (gaView) {
      assign(data.accounts.analytics, {
        ga_view_id: gaView.id,
        ga_view_name: gaView.name
      })
    }

    forEach(elements, ({type, name, checked}) => {
      const prefix = 'role_'

      if (type === 'checkbox' && startsWith(name, prefix) && checked) {
        data.roles.push(name.substr(prefix.length))
      }
    })

    return data
  },
  onChangeAnalyticsAccount (gaAccount) {
    const {dispatch, params} = this.props

    if (gaAccount) {
      this.setState({gaAccount})

      dispatch(loadGAPropertiesAction, params, gaAccount)
    } else {
      this.setState({gaAccount: null})
    }
  },
  onChangeProperty (gaProperty) {
    const {dispatch, params} = this.props

    if (gaProperty) {
      this.setState({gaProperty})

      dispatch(loadGAViewsAction, params, this.state.gaAccount, gaProperty.id)
    } else {
      this.setState({gaAccount: null})
    }
  },
  onChangeView (gaView) {
    this.setState({gaView})
  }
}
