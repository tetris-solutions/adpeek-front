import {PropTypes} from 'react'
import find from 'lodash/find'
import get from 'lodash/get'
import {loadDashCampaignsAction} from '../../actions/load-dash-campaigns'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import startsWith from 'lodash/startsWith'

export default {
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object
  },
  propTypes: {
    params: PropTypes.object,
    company: PropTypes.shape({
      dashCampaigns: PropTypes.array
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      isLoadingDashCampaigns: true,
      dashCampaign: this.getCurrentCampaign(),
      name: get(this.props, 'workspace.name', '')
    }
  },
  componentWillMount () {
    const {company, dispatch} = this.props

    if (company.dashCampaigns) {
      this.setState({isLoadingDashCampaigns: false})
    } else {
      dispatch(loadDashCampaignsAction, company.id)
        .then(() => this.setState({isLoadingDashCampaigns: false}))
    }
  },
  componentWillReceiveProps ({company: {dashCampaigns}}) {
    if (this.props.company.dashCampaigns !== dashCampaigns) {
      this.setState({
        dashCampaign: this.getCurrentCampaign(dashCampaigns)
      })
    }
  },
  getCurrentCampaign (dashCampaigns = this.props.company.dashCampaigns) {
    const campaignId = get(this.state, 'dashCampaign.id') || get(this.props, 'workspace.dash_campaign')

    if (!campaignId) return null

    return find(dashCampaigns, {id: campaignId}) || {id: campaignId, name: campaignId}
  },
  onChangeDashCampaign (dashCampaign) {
    if (dashCampaign) {
      this.setState({
        dashCampaign: find(this.props.company.dashCampaigns, {
          id: dashCampaign.value
        })
      })
    } else {
      this.setState({dashCampaign: null})
    }
  },
  normalizeDashCampaignOption ({id: value, name: text}) {
    return {text, value}
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
      dash_campaign: elements.dash_campaign.value || null,
      accounts: {
        facebook: JSON.parse(elements.facebook_account.value),
        adwords: JSON.parse(elements.adwords_account.value)
      },
      roles: []
    }

    Object.keys(elements)
      .forEach(function parseRole (name) {
        const prefix = 'role_'

        if (startsWith(name, prefix) && elements[name].checked) {
          data.roles.push(name.substr(prefix.length))
        }
      })

    return data
  }
}
