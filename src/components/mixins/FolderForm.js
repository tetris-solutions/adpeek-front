import React from 'react'
import assign from 'lodash/assign'
import find from 'lodash/find'
import get from 'lodash/get'
import concat from 'lodash/concat'
import map from 'lodash/map'
import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
import {loadDashCampaignsAction} from '../../actions/load-dash-campaigns'
import {loadKPIMetadataAction} from '../../actions/load-kpi-meta-data'
import {loadGASegmentsAction} from '../../actions/load-ga-segments'

export default {
  CREATE_OPTION_FLAG: '+1',
  contextTypes: {
    router: React.PropTypes.object,
    messages: React.PropTypes.object
  },
  propTypes: {
    params: React.PropTypes.object,
    cursors: React.PropTypes.object,
    company: React.PropTypes.shape({
      dashCampaigns: React.PropTypes.array
    }).isRequired,
    dispatch: React.PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      isLoadingDashCampaigns: true,
      dashCampaign: this.getCurrentCampaign(),
      name: get(this.props, 'folder.name', '')
    }
  },
  componentWillMount () {
    let gaSegment = get(this.props, 'folder.ga_segment', null)

    if (gaSegment && !gaSegment.id) {
      gaSegment = assign({}, gaSegment, {
        id: this.CREATE_OPTION_FLAG,
        name: this.context.messages.newGASegmentLabel
      })
    }

    this.setState({gaSegment})
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
  },
  onChangeSegment (segment) {
    this.setState({
      gaSegment: segment
        ? find(this.rawSegments(), {id: segment.value})
        : null
    })
  },
  onChangeSegmentDefinition ({target: {value}}) {
    this.setState({
      gaSegment: assign(this.state.gaSegment, {definition: value})
    })
  },
  rawSegments () {
    return concat(
      {
        id: this.CREATE_OPTION_FLAG,
        name: this.context.messages.newGASegmentLabel,
        definition: '',
        type: 'CUSTOM'
      },
      get(this.props.cursors, 'workspace.accounts.analytics.segments', [])
    )
  },
  getSegments () {
    return map(sortBy(this.rawSegments(), this.customFirst), this.normalizeAutoSelectOpt)
  },
  customFirst: ({type}) => type === 'CUSTOM' ? 0 : 1,
  normalizeAutoSelectOpt: ({id: value, name: text}) => ({text, value})
}
