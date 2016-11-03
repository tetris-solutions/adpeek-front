import React from 'react'
import head from 'lodash/head'
import uniq from 'lodash/uniq'
import concat from 'lodash/concat'
import endsWith from 'lodash/endsWith'
import ReportController from './ReportController'
import ReportControllerX from './ReportControllerX'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import {loadReportEntitiesAction} from '../actions/load-report-entities'
import {loadReportMetaDataAction, loadCrossPlatformReportMetaDataAction} from '../actions/load-report-meta-data'
import has from 'lodash/has'
import map from 'lodash/map'
import Page from './Page'
import SubHeader from './SubHeader'
import LoadingHorizontal from './LoadingHorizontal'
import Message from 'tetris-iso/Message'
import pick from 'lodash/pick'

const {PropTypes} = React
const empty = []

const transformAccount = ({external_id, tetris_id, platform}) => ({
  ad_account: external_id,
  platform: platform,
  tetris_account: tetris_id
})

const Placeholder = ({children}) => (
  <div>
    <SubHeader/>
    <Page>
      {children}
    </Page>
  </div>
)

Placeholder.displayName = 'Report-Placeholder'
Placeholder.propTypes = {
  children: PropTypes.node.isRequired
}

const Report = React.createClass({
  displayName: 'Report',
  contextTypes: {
    messages: PropTypes.object
  },
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    metaData: PropTypes.object,
    campaigns: PropTypes.array,
    adSets: PropTypes.array,
    adGroups: PropTypes.array,
    ads: PropTypes.array,
    keywords: PropTypes.array,
    accounts: PropTypes.arrayOf(PropTypes.shape({
      external_id: PropTypes.string,
      tetris_id: PropTypes.string,
      platform: PropTypes.string
    })).isRequired
  },
  getInitialState () {
    return {isLoading: true}
  },
  componentDidMount () {
    this.load()
  },
  isFolderLevel () {
    return inferLevelFromParams(this.props.params) === 'folder'
  },
  getPlatforms () {
    return uniq(map(this.props.accounts, 'platform'))
  },
  getEntities () {
    const {messages} = this.context
    const {campaigns, adSets, adGroups, ads, keywords} = this.props

    const entities = [{
      id: 'Campaign',
      name: messages.campaigns,
      list: campaigns
    }]

    entities.push({
      id: 'AdGroup',
      name: messages.adGroups,
      list: adGroups || empty
    })

    entities.push({
      id: 'Keyword',
      name: messages.keywords,
      list: keywords || empty
    })

    entities.push({
      id: 'AdSet',
      name: messages.adSets,
      list: adSets || empty
    })

    entities.push({
      id: 'Ad',
      name: messages.ads,
      list: ads || empty
    })

    return entities
  },
  loadEntities (account) {
    const {ads, params, dispatch} = this.props

    if (ads) {
      return Promise.resolve()
    }

    return dispatch(loadReportEntitiesAction, params, pick(account, 'tetris_id', 'external_id', 'platform'))
  },
  loadMultiPlatformMetaData (entity) {
    const {metaData, dispatch} = this.props

    if (has(metaData, entity)) {
      return Promise.resolve()
    }

    return dispatch(loadCrossPlatformReportMetaDataAction, this.getPlatforms(), entity)
  },
  loadSinglePlatformMetaData (entity) {
    const {metaData, dispatch} = this.props
    const platform = head(this.getPlatforms())

    if (has(metaData, entity)) {
      return Promise.resolve()
    }

    return dispatch(loadReportMetaDataAction, platform, entity)
  },
  loadMetaData (entity) {
    return this.isFolderLevel()
      ? this.loadSinglePlatformMetaData(entity)
      : this.loadMultiPlatformMetaData(entity)
  },
  load () {
    const promises = concat(
      map(this.getEntities(), ({id}) => this.loadMetaData(id)),
      map(this.props.accounts, this.loadEntities)
    )

    Promise.all(promises)
      .then(() => this.setState({isLoading: false}))
  },
  render () {
    const {location, dispatch, params, accounts, metaData, report} = this.props

    if (this.state.isLoading) {
      return (
        <Placeholder>
          <LoadingHorizontal>
            <Message>loadingReport</Message>
          </LoadingHorizontal>
        </Placeholder>
      )
    }

    if (!this.isFolderLevel()) {
      return (
        <ReportControllerX
          dispatch={dispatch}
          params={params}
          report={report}
          metaData={metaData}
          editMode={endsWith(location.pathname, '/edit')}
          accounts={map(accounts, transformAccount)}
          entities={this.getEntities()}/>
      )
    }

    return (
      <ReportController
        dispatch={dispatch}
        params={params}
        report={report}
        metaData={metaData}
        editMode={endsWith(location.pathname, '/edit')}
        reportParams={transformAccount(head(accounts))}
        entities={this.getEntities()}/>
    )
  }
})

export default Report
