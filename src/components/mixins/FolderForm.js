import {PropTypes} from 'react'
import find from 'lodash/find'
import get from 'lodash/get'
import {loadDashCampaignsAction} from '../../actions/load-dash-campaigns'

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
  }
}
