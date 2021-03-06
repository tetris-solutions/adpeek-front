import PropTypes from 'prop-types'
import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
import {loadDashCampaignsAction} from '../../actions/load-dash-campaigns'
import {loadKPIMetadataAction} from '../../actions/load-kpi-meta-data'
import {loadGASegmentsAction} from '../../actions/load-ga-segments'

export default {
  CREATE_OPTION_FLAG: '+1',
  DEFAULT_GA_SEGMENT: {
    id: '-1',
    name: 'All Users',
    definition: '',
    type: 'BUILT_IN'
  },
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object
  },
  propTypes: {
    folder: PropTypes.object,
    workspace: PropTypes.object,
    params: PropTypes.object,
    cursors: PropTypes.object,
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
    const {folder} = this.props

    if (folder) {
      this.setState({
        gaSegment: folder.ga_segment || null
      })
    }
  },
  componentDidMount () {
    if (this.isConnectedToDash()) {
      this.loadDashCampaigns()
    }

    const {params, dispatch, workspace} = this.props
    const analytics = get(workspace, 'accounts.analytics')

    if (analytics) {
      dispatch(loadGASegmentsAction, params, analytics)
        .then(() => this.forceUpdate())
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

    dispatch(loadDashCampaignsAction, company.id)
      .then(() => this.setState({isLoadingDashCampaigns: false}))
  },
  getCurrentCampaign (dashCampaigns = this.props.company.dashCampaigns) {
    const campaignId = get(this.state, 'dashCampaign.id') || get(this.props, 'folder.dash_campaign')

    if (!campaignId) return null

    return find(dashCampaigns, {id: campaignId}) || {id: campaignId}
  },
  onChangeDashCampaign (dashCampaign) {
    if (dashCampaign) {
      dashCampaign = dashCampaign.value === this.CREATE_OPTION_FLAG
        ? {id: this.CREATE_OPTION_FLAG, name: dashCampaign.text}
        : find(this.props.company.dashCampaigns, {
          id: dashCampaign.value
        })

      this.setState({dashCampaign})
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
  onChangeInput ({target: {value, name}}) {
    this.update({
      [name]: value,
      errors: omit(this.state.errors, name)
    })
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
  },
  onChangeSegment (segment) {
    this.setState({
      gaSegment: segment
        ? find(this.rawSegments(), {id: segment.value})
        : null
    })
  },
  rawSegments () {
    return get(this.props.cursors, 'workspace.accounts.analytics.segments', [])
  },
  getSegments () {
    return map(sortBy(this.rawSegments(), this.customFirst), this.normalizeAutoSuggestOption)
  },
  customFirst: ({type}) => type === 'CUSTOM' ? 0 : 1,
  normalizeAutoSuggestOption: ({id: value, name: text}) => ({text, value}),
  hasAnalytics () {
    return Boolean(this.props.workspace.accounts.analytics)
  },
  isAnalytics () {
    const accountPlatform = get(find(this.props.workspace.accounts, {id: this.state.workspace_account}), 'platform')
    return accountPlatform === 'analytics'
  }
}
