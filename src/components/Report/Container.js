import React from 'react'
import some from 'lodash/some'
import head from 'lodash/head'
import uniq from 'lodash/uniq'
import includes from 'lodash/includes'
import concat from 'lodash/concat'
import ReportController from './Controller'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import {loadReportEntitiesAction} from '../../actions/load-report-entities'
import {loadReportMetaDataAction, loadCrossPlatformReportMetaDataAction} from '../../actions/load-report-meta-data'
import has from 'lodash/has'
import map from 'lodash/map'
import Page from '../Page'
import SubHeader from '../SubHeader'
import LoadingHorizontal from '../LoadingHorizontal'
import Message from 'tetris-iso/Message'
import pick from 'lodash/pick'
const empty = []

const transformAccount = ({external_id, tetris_id, platform}) => ({
  ad_account: external_id,
  platform: platform,
  tetris_account: tetris_id
})

const Placeholder = ({reportLiteMode, children}) => (
  <div>
    <SubHeader/>
    {reportLiteMode
      ? children
      : <Page>{children}</Page>}
  </div>
)

Placeholder.displayName = 'Report-Placeholder'
Placeholder.propTypes = {
  children: React.PropTypes.node.isRequired,
  reportLiteMode: React.PropTypes.bool
}

const ReportContainer = React.createClass({
  displayName: 'Report-Container',
  contextTypes: {
    messages: React.PropTypes.object
  },
  propTypes: {
    children: React.PropTypes.node,
    reportLiteMode: React.PropTypes.bool,
    editMode: React.PropTypes.bool,
    isGuestUser: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
    report: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    metaData: React.PropTypes.object,
    campaigns: React.PropTypes.array,
    adSets: React.PropTypes.array,
    adGroups: React.PropTypes.array,
    ads: React.PropTypes.array,
    keywords: React.PropTypes.array,
    accounts: React.PropTypes.arrayOf(React.PropTypes.shape({
      external_id: React.PropTypes.string,
      tetris_id: React.PropTypes.string,
      platform: React.PropTypes.string
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
  entitiesSource () {
    const {messages} = this.context
    const {campaigns, adSets, adGroups, ads, keywords} = this.props

    return {
      messages,
      campaigns,
      adSets,
      ads,
      keywords,
      adGroups
    }
  },
  calculateEntities ({messages, campaigns, adSets, ads, keywords, adGroups}) {
    const entities = [{
      id: 'Campaign',
      name: messages.campaigns,
      list: campaigns
    }]

    if (this.isFolderLevel()) {
      const platforms = this.getPlatforms()
      const hasAdwords = includes(platforms, 'adwords')
      const hasFacebook = includes(platforms, 'facebook')

      if (hasAdwords) {
        entities.push({
          id: 'Placement',
          name: messages.placementLevel,
          list: campaigns
        })

        entities.push({
          id: 'Search',
          name: messages.searchLevel,
          list: adGroups
        })

        entities.push({
          id: 'Audience',
          name: messages.audienceLevel,
          list: adGroups
        })

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
      }

      if (hasFacebook) {
        entities.push({
          id: 'AdSet',
          name: messages.adSets,
          list: adSets || empty
        })
      }

      entities.push({
        id: 'Ad',
        name: messages.ads,
        list: ads || empty
      })
    }

    return entities
  },
  differs (val, name) {
    return val !== this._source[name]
  },
  getEntities () {
    if (this._source) {
      const newSource = this.entitiesSource()
      const anyChange = some(newSource, this.differs)

      if (anyChange) {
        this._source = newSource
        this._entities = this.calculateEntities(newSource)
      }
    } else {
      this._source = this.entitiesSource()
      this._entities = this.calculateEntities(this._source)
    }

    return this._entities
  },
  loadEntities (account) {
    const {campaigns, params, dispatch} = this.props

    if (campaigns) {
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
    const {reportLiteMode, accounts} = this.props
    if (this.state.isLoading) {
      return (
        <Placeholder reportLiteMode={reportLiteMode}>
          <LoadingHorizontal>
            <Message>loadingReport</Message>
          </LoadingHorizontal>
        </Placeholder>
      )
    }

    return (
      <ReportController
        {...this.props}
        accounts={map(accounts, transformAccount)}
        entities={this.getEntities()}/>
    )
  }
})

const R = props =>
  props.children
    ? props.children
    : <ReportContainer {...props}/>

R.displayName = 'Report-Wrapper'
R.propTypes = {
  children: React.PropTypes.node
}

export default R
