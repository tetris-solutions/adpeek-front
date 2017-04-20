import React from 'react'
import PropTypes from 'prop-types'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import head from 'lodash/head'
import uniq from 'lodash/uniq'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
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
import log from 'loglevel'
import filter from 'lodash/filter'
import join from 'lodash/join'
import negate from 'lodash/negate'

const empty = []

function transformAccount ({external_id, tetris_id, platform, ga_property_id, ga_view_id}) {
  const acc = {
    ad_account: external_id,
    platform: platform,
    tetris_account: tetris_id
  }

  if (platform === 'analytics') {
    acc.ga_property_id = ga_property_id
    acc.ga_view_id = ga_view_id
  }

  return acc
}

const Placeholder = ({reportLiteMode, children}) => (
  <div>
    <SubHeader/>
    <Page>{children}</Page>
  </div>
)

Placeholder.displayName = 'Report-Placeholder'
Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
  reportLiteMode: PropTypes.bool
}

const nooP = () => Promise.resolve()
const none = () => ({})
const canonical = (entity) => {
  switch (entity) {
    case 'Placement':
      return 'Campaign'
    case 'Search':
    case 'Audience':
    case 'Location':
      return 'AdGroup'
    default:
      return entity
  }
}

class Container extends React.Component {
  static displayName = 'Report-Container'

  static contextTypes = {
    messages: PropTypes.object
  }

  static propTypes = {
    children: PropTypes.node,
    reportLiteMode: PropTypes.bool,
    editMode: PropTypes.bool,
    isGuestUser: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    metaData: PropTypes.object,
    campaigns: PropTypes.array,
    adSets: PropTypes.array,
    adGroups: PropTypes.array,
    ads: PropTypes.array,
    videos: PropTypes.array,
    keywords: PropTypes.array,
    accounts: PropTypes.arrayOf(PropTypes.shape({
      external_id: PropTypes.string,
      tetris_id: PropTypes.string,
      platform: PropTypes.string
    })).isRequired
  }

  state = {}
  promiseRegister = {}

  componentDidMount () {
    this.load()
  }

  componentWillMount () {
    this.setLoadingState('metaData', true)
  }

  isFolderLevel = () => {
    return inferLevelFromParams(this.props.params) === 'folder'
  }

  getPlatforms = () => {
    return uniq(map(this.props.accounts, 'platform'))
  }

  entitiesSource = () => {
    const {messages} = this.context
    const {campaigns, adSets, adGroups, ads, keywords, videos} = this.props

    return {
      messages,
      campaigns,
      adSets,
      ads,
      keywords,
      adGroups,
      videos
    }
  }

  calculateEntities = ({messages, campaigns = empty, adSets = empty, ads = empty, keywords = empty, adGroups = empty, videos = empty}) => {
    log.info('will mount report entities')

    const entities = [{
      id: 'Campaign',
      name: messages.campaigns,
      list: campaigns,
      loading: this.getLoadingState('Campaign')
    }]

    if (this.isFolderLevel()) {
      const platforms = this.getPlatforms()
      const hasAdwords = includes(platforms, 'adwords')
      const hasFacebook = includes(platforms, 'facebook')

      if (hasAdwords) {
        entities.push({
          id: 'Placement',
          name: messages.placementLevel,
          list: campaigns,
          loading: this.getLoadingState('Placement')
        })

        entities.push({
          id: 'Search',
          name: messages.searchLevel,
          list: adGroups,
          loading: this.getLoadingState('Search')
        })

        entities.push({
          id: 'Location',
          name: messages.locationLevel,
          list: adGroups,
          loading: this.getLoadingState('Location')
        })

        entities.push({
          id: 'Audience',
          name: messages.audienceLevel,
          list: adGroups,
          loading: this.getLoadingState('Audience')
        })

        entities.push({
          id: 'AdGroup',
          name: messages.adGroups,
          list: adGroups,
          loading: this.getLoadingState('AdGroup')
        })

        entities.push({
          id: 'Video',
          name: messages.videos,
          list: videos,
          loading: this.getLoadingState('Video')
        })

        entities.push({
          id: 'Keyword',
          name: messages.keywords,
          list: keywords,
          loading: this.getLoadingState('Keyword')
        })
      }

      if (hasFacebook) {
        entities.push({
          id: 'AdSet',
          name: messages.adSets,
          list: adSets,
          loading: this.getLoadingState('AdSet')
        })
      }

      entities.push({
        id: 'Ad',
        name: messages.ads,
        list: ads,
        loading: this.getLoadingState('Ad')
      })
    }

    return entities
  }

  getEntities = () => {
    return this.calculateEntities(this.entitiesSource())
  }

  loadEntities = (account) => {
    const {campaigns, params, dispatch} = this.props

    if (campaigns) {
      return Promise.resolve()
    }

    return dispatch(loadReportEntitiesAction, params, pick(account, 'tetris_id', 'external_id', 'platform'))
  }

  loadMultiPlatformMetaData = (entity) => {
    const {metaData, dispatch} = this.props

    if (has(metaData, entity)) {
      return Promise.resolve()
    }

    return dispatch(loadCrossPlatformReportMetaDataAction, this.getPlatforms(), entity)
  }

  loadSinglePlatformMetaData = (entity) => {
    const {metaData, dispatch} = this.props
    const platform = head(this.getPlatforms())

    if (has(metaData, entity)) {
      return Promise.resolve()
    }

    return dispatch(loadReportMetaDataAction, platform, entity)
  }

  loadMetaData = (entity) => {
    return this.isFolderLevel()
      ? this.loadSinglePlatformMetaData(entity)
      : this.loadMultiPlatformMetaData(entity)
  }

  getLoadingState = (key) => {
    return this.state[`loading__${canonical(key)}`]
  }

  setLoadingState = (key, value) => {
    key = `loading__${canonical(key)}`

    if (this.state[key] !== value) {
      this.setState({[key]: value})
    }
  }

  parentEntityLink (entity) {
    const {report} = this.props

    switch (entity) {
      case 'Campaign':
        return {
          load: nooP,
          query: none
        }
      case 'AdGroup':
        return {
          load: () => this.loadEntity('Campaign'),
          query: () => ({campaigns: join(map(this.props.campaigns, 'id'), ',')})
        }
      case 'AdSet':
        return {
          load: () => this.loadEntity('AdSet'),
          query: () => ({campaigns: join(map(this.props.campaigns, 'id'), ',')})
        }
      case 'Ad':
        return report.platform === 'facebook' ? {
          load: () => this.loadEntity('Campaign'),
          query: () => ({campaigns: join(map(this.props.campaigns, 'id'), ',')})
        } : {
          load: () => this.loadEntity('AdGroup'),
          query: () => ({adGroups: join(map(this.props.adGroups, 'id'), ',')})
        }
      case 'Keyword':
        const isActive = ({status, campaign_status}) => (
          status === 'ENABLED' && (
            !campaign_status ||
            campaign_status === 'ENABLED' ||
            campaign_status === 'SERVING'
          )
        )

        return {
          load: () => this.loadEntity('AdGroup'),
          query: () => ({
            activeAdGroups: join(map(filter(this.props.adGroups, isActive), 'id'), ','),
            inactiveAdGroups: join(map(filter(this.props.adGroups, negate(isActive)), 'id'), ',')
          })
        }
    }
  }

  loadEntity = (entity) => {
    entity = canonical(entity)

    const {accounts, params, dispatch} = this.props

    const dispatchEntityLoadingAction = (account, query) => {
      return dispatch(loadReportEntitiesAction,
        params,
        assign({}, pick(account, 'tetris_id', 'external_id', 'platform'), query),
        entity)
    }

    if (this.getLoadingState(entity) === false) {
      return Promise.resolve()
    }

    if (!this.promiseRegister[entity]) {
      const parentEntity = this.parentEntityLink(entity)

      this.promiseRegister[entity] = parentEntity.load()
        .then(() => Promise.all(map(accounts,
          account => dispatchEntityLoadingAction(account, parentEntity.query(account)))))
    }

    this.setLoadingState(entity, true)

    return this.promiseRegister[entity]
      .then(() => this.setLoadingState(entity, false))
  }

  load = () => {
    const entityMap = this.getEntities()
    const keysToMarkAsLoaded = ['metaData']

    let promises = map(entityMap, ({id}) =>
      this.loadMetaData(id))

    if (this.isFolderLevel()) {
      // load on demand
      const {report: {modules}} = this.props

      forEach(modules, ({entity}) => this.loadEntity(entity))
    } else {
      // bulk load
      promises = concat(promises, map(this.props.accounts, this.loadEntities))

      forEach(entityMap, ({id}) => {
        keysToMarkAsLoaded.push(id)
      })
    }

    Promise.all(promises).then(() =>
      map(keysToMarkAsLoaded, key =>
        this.setLoadingState(key, false)))
  }

  getAccounts = () => {
    this._accounts = this._accounts || map(this.props.accounts, transformAccount)

    return this._accounts
  }

  render () {
    if (this.getLoadingState('metaData')) {
      return (
        <Placeholder>
          <LoadingHorizontal>
            <Message>loadingReport</Message>
          </LoadingHorizontal>
        </Placeholder>
      )
    }

    log.debug('render report <Container/>')

    return (
      <ReportController
        {...this.props}
        loadEntity={this.loadEntity}
        accounts={this.getAccounts()}
        entities={this.getEntities()}/>
    )
  }
}

const Report = props =>
  props.children
    ? props.children
    : <Container {...props}/>

Report.displayName = 'Report'
Report.propTypes = {
  children: PropTypes.node
}

export default Report
