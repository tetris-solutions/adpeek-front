import {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import find from 'lodash/find'
import get from 'lodash/get'
import {loadDashCampaignsAction} from '../../actions/load-dash-campaigns'
import {loadKPIMetadataAction} from '../../actions/load-kpi-meta-data'
import omit from 'lodash/omit'

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
      name: get(this.props, 'folder.name', '')
    }
  },
  componentWillMount () {
    if (this.isConnectedToDash()) {
      this.loadDashCampaigns()
    }
  },
  componentWillReceiveProps ({company: {dashCampaigns}}) {
    if (this.props.company.dashCampaigns !== dashCampaigns) {
      this.setState({
        dashCampaign: this.getCurrentCampaign(dashCampaigns)
      })
    }
  },
  isConnectedToDash () {
    return Boolean(this.props.company.legacy_dash_url)
  },
  loadDashCampaigns () {
    const {company, dispatch} = this.props

    if (company.dashCampaigns) {
      this.setState({isLoadingDashCampaigns: false})
    } else {
      dispatch(loadDashCampaignsAction, company.id)
        .then(() => this.setState({isLoadingDashCampaigns: false}))
    }
  },
  getCurrentCampaign (dashCampaigns = this.props.company.dashCampaigns) {
    const campaignId = get(this.state, 'dashCampaign.id') || get(this.props, 'folder.dash_campaign')

    if (!campaignId) return null

    return find(dashCampaigns, {id: campaignId}) || {id: campaignId}
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
  normalizeDashCampaignOption ({id, name}) {
    return {
      value: id,
      text: `${id} :: ${name || '???'}`
    }
  },
  saveAndDismiss (name) {
    return ({target: {value}}) => {
      const errors = omit(this.state.errors, name)
      this.update({errors, [name]: value})
    }
  },
  getPlatform () {
    if (this.props.folder) {
      return this.props.folder.account.platform
    }

    const {workspace: {accounts}} = this.props
    /**
     *
     * @type {HTMLFormElement}
     */
    const form = ReactDOM.findDOMNode(this).querySelector('form')
    const selectedAccount = form.elements.workspace_account.value
    const account = find(accounts, {id: selectedAccount})

    return account.platform
  },
  loadKPI (kpi = null) {
    this.props.dispatch(
      loadKPIMetadataAction,
      kpi || this.state.kpi,
      this.getPlatform()
    )
  },
  getKPIFormat () {
    const type = get(this.props, ['kpis', this.getPlatform(), this.state.kpi, 'type'])

    switch (type) {
      case 'percentage':
      case 'currency':
        return type
      default:
        return 'decimal'
    }
  },
  update (changes) {
    if (changes.kpi || changes.workspace_account) {
      this.loadKPI(changes.kpi)

      changes.kpi_goal = 0
    }

    this.setState(changes)
  }
}
