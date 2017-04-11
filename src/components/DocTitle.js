import React from 'react'
import PropTypes from 'prop-types'
import {many} from './higher-order/branch'
import {inferLevelFromProps} from '../functions/infer-level-from-params'
import Helmet from 'react-helmet'
import join from 'lodash/join'
import compact from 'lodash/compact'
import loglevel from 'loglevel'

class DocTitle extends React.Component {
  static displayName = 'Doc-Title'

  static propTypes = {
    report: PropTypes.object,
    order: PropTypes.object,
    campaign: PropTypes.object,
    folder: PropTypes.object,
    workspace: PropTypes.object,
    company: PropTypes.object
  }

  componentDidMount () {
    this.checkpoint()
  }

  componentDidUpdate () {
    if (process.env.NODE_ENV === 'production' && this.getCurrentUrl() !== this._url) {
      this.track()
    }
    this.checkpoint()
  }

  checkpoint = () => {
    this._url = this.getCurrentUrl()
  }

  track = () => {
    try {
      this.trackGA()
    } catch (e) {
      loglevel.error(e)
    }

    try {
      this.trackPIWIK()
    } catch (e) {
      loglevel.error(e)
    }
  }

  trackPIWIK = () => {
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['setCustomUrl', this.getCurrentUrl()])
    window._paq.push(['trackPageView'])
  }

  trackGA = () => {
    window.ga('send', {
      hitType: 'pageview',
      page: this.getCurrentUrl(),
      title: document.title
    })
  }

  getCurrentUrl = () => {
    return window.location.pathname + window.location.search
  }

  getTitle = () => {
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
  }

  render () {
    return (
      <Helmet>
        <title>{this.getTitle()}</title>
      </Helmet>
    )
  }
}

export default many([
  {user: ['user']},
  ['user', 'company'],
  ['company', 'workspace'],
  ['workspace', 'folder'],
  [inferLevelFromProps, 'report'],
  ['folder', 'order'],
  ['folder', 'campaign']
], DocTitle)
