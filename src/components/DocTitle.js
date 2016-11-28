import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Helmet from 'react-helmet'
import join from 'lodash/join'
import compact from 'lodash/compact'

const {PropTypes} = React

const DocTitle = React.createClass({
  displayName: 'Doc-Title',
  propTypes: {
    report: PropTypes.object,
    order: PropTypes.object,
    campaign: PropTypes.object,
    folder: PropTypes.object,
    workspace: PropTypes.object,
    company: PropTypes.object
  },
  componentDidMount () {
    this.checkpoint()
  },
  componentDidUpdate () {
    if (process.env.NODE_ENV === 'production' && this.getCurrentUrl() !== this._url) {
      this.track()
    }
    this.checkpoint()
  },
  checkpoint () {
    this._url = this.getCurrentUrl()
  },
  track () {
    try {
      this.trackGA()
    } catch (e) {
    }

    try {
      this.trackPIWIK()
    } catch (e) {
    }
  },
  trackPIWIK () {
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['setCustomUrl', this.getCurrentUrl()])
    window._paq.push(['trackPageView'])
  },
  trackGA () {
    window.ga('send', {
      hitType: 'pageview',
      page: this.getCurrentUrl(),
      title: document.title
    })
  },
  getCurrentUrl () {
    return window.location.pathname + window.location.search
  },
  getTitle () {
    const {report, order, campaign, folder, workspace, company} = this.props

    const parts = [
      'Tetris Solutions',
      'Manager',
      company && company.name,
      workspace && workspace.name,
      folder && folder.name,
      campaign && campaign.name,
      order && order.name,
      report && report.name
    ].reverse()

    return join(compact(parts), ' - ')
  },
  render () {
    return <Helmet title={this.getTitle()}/>
  }
})

export default contextualize(DocTitle, 'order', 'report', 'campaign', 'folder', 'workspace', 'company')
