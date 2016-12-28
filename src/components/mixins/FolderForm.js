import {PropTypes} from 'react'
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
  getPlatform (workspace_account) {
    if (!workspace_account) return null

    if (this.props.folder) {
      return this.props.folder.account.platform
    }

    const account = find(this.props.workspace.accounts, {id: workspace_account})

    return account.platform
  },
  loadKPI (kpi, workspace_account) {
    kpi = kpi || this.state.kpi
    const platform = this.getPlatform(workspace_account || this.state.workspace_account)

    if (!kpi || !platform) {
      return
    }

    this.props.dispatch(loadKPIMetadataAction, kpi, platform)
  },
  getKPIFormat () {
    const platform = this.getPlatform(this.state.workspace_account)
    const {kpi} = this.state
    const type = get(this.props, ['kpis', platform, kpi, 'type'])

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
      this.loadKPI(changes.kpi, changes.workspace_account)

      changes.kpi_goal = 0
    }

    this.setState(changes)
  }
}
