import React from 'react'
import PropTypes from 'prop-types'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import some from 'lodash/some'
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
import equals from 'shallowequal'
import filter from 'lodash/filter'
import join from 'lodash/join'
import negate from 'lodash/negate'
import startsWith from 'lodash/startsWith'

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

class Container extends React.Component {
  static displayName = 'Report-Container'

  static contextTypes = {
    messages: PropTypes.object,
    location: PropTypes.shape({
      query: PropTypes.object
    })
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

  checkOnDemandFlag () {
    return Boolean(this.context.location.query.onDemand)
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
          id: 'Location',
          name: messages.locationLevel,
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
          list: adGroups
        })

        entities.push({
          id: 'Video',
          name: messages.videos,
          list: videos
        })

        entities.push({
          id: 'Keyword',
          name: messages.keywords,
          list: keywords
        })
      }

      if (hasFacebook) {
        entities.push({
          id: 'AdSet',
          name: messages.adSets,
          list: adSets
        })
      }

      entities.push({
        id: 'Ad',
        name: messages.ads,
        list: ads
      })
    }

    return entities
  }

  getEntities = () => {
    const newSource = this.entitiesSource()
    const anyChange = !this._source || !equals(this._source, newSource)

    if (anyChange) {
      this._source = newSource
      this._entities = this.calculateEntities(this._source)
    }

    return this._entities
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

  loadingInProgress = () => {
    const map = {}

    forEach(this.state, (value, key) => {
      if (startsWith(key, 'loading__')) {
        map[key] = value
      }
    })

    return map
  }

  getLoadingState = (key) => {
    return this.state[`loading__${key}`]
  }

  setLoadingState = (key, state) => {
    this.setState({
      [`loading__${key}`]: state
    })
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

    this.setLoadingState('metaData', true)

    let promises = map(entityMap, ({id}) =>
      this.loadMetaData(id))

    if (this.checkOnDemandFlag()) {
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
    if (some(this.loadingInProgress()) || !this.props.metaData || !this.props.campaigns) {
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
