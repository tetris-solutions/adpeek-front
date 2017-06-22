import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import {Button} from '../Button'
import AdGroups from './AdGroups'
import Message from 'tetris-iso/Message'
import {loadAdGroupsAction} from '../../actions/load-adgroups'
import {loadAdGroupSearchTermsAction} from '../../actions/load-adgroup-search-terms'
import {createAdGroupsReportAction} from '../../actions/create-folder-adgroups-report'
import {pushAdGroupAction} from '../../actions/create-adgroup'
import {updateAdGroupsAction} from '../../actions/update-adgroups'
import NotImplemented from '../NotImplemented'
import LoadingHorizontal from '../LoadingHorizontal'
import SubHeader from '../SubHeader'
import Page from '../Page'
import {loadKeywordsRelevanceAction} from '../../actions/load-keywords-relevance'
import {loadAdsKPIAction} from '../../actions/load-ads-kpi'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import chunk from 'lodash/chunk'
import endsWith from 'lodash/endsWith'

const statusIcons = {
  enabled: 'play_arrow',
  enabled_or_paused: 'pause',
  all: 'playlist_add_check'
}

export class Creatives extends React.Component {
  static displayName = 'Creatives'

  static propTypes = {
    dispatch: PropTypes.func,
    folder: PropTypes.object.isRequired,
    adGroups: PropTypes.array,
    getAdGroupsWithRelevance: PropTypes.func,
    platform: PropTypes.string,
    params: PropTypes.object
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  static childContextTypes = {
    setDirty: PropTypes.func
  }

  getChildContext () {
    return {
      setDirty: this.setDirty
    }
  }

  setDirty = (dirty = true) => {
    if (dirty !== this.state.dirty) {
      this.setState({dirty})
    }
  }

  isAdwords = () => {
    return this.props.platform === 'adwords'
  }

  componentDidMount () {
    window.event$.on('create::adgroup', this.createAdGroup)

    if (this.isAdwords()) {
      this.loadAdGroups()
    }
  }

  componentWillReceiveProps (props, {location: {query}}) {
    const newFilter = query.filter || 'enabled'
    const currentFilter = this.getStatusFilter()

    if (!this.state.isLoading && newFilter !== currentFilter) {
      this.setState({isLoading: true}, this.loadAdGroups)
    }
  }

  componentWillUnmount () {
    window.event$.off('create::adgroup', this.createAdGroup)
  }

  onReportCreated = (response) => {
    this.setState({creatingReport: false})

    window.location.href = response.data.url
  }

  loadAdGroups = () => {
    const {params, dispatch} = this.props

    this.loadingAdGroups = dispatch(loadAdGroupsAction, params, this.getStatusFilter())
      .then(() => this.setState({isLoading: false}))
  }

  onAdGroupsLoaded = () => {
    const {getAdGroupsWithRelevance, dispatch, params} = this.props

    dispatch(createAdGroupsReportAction, params, getAdGroupsWithRelevance())
      .then(this.onReportCreated)
  }

  extractReport = () => {
    if (!this.isAdwords()) return

    this.setState({creatingReport: true})

    this.loadingAdGroups.then(this.onAdGroupsLoaded)
  }

  loadKeywordsRelevance = () => {
    this.setState({calculatingRelevance: true})

    this.loadingAdGroups.then(this.bulkLoadRelevance)
      .then(() => this.setState({calculatingRelevance: false}))
  }

  bulkLoadRelevance = () => {
    const {dispatch, params, adGroups} = this.props

    const keywordList =
      uniq(flatten(map(adGroups,
        ({keywords}) => map(keywords, 'id'))))

    const chunks = chunk(keywordList, 500)

    let promise = Promise.resolve()

    chunks.forEach(keywords => {
      promise = promise.then(() =>
        dispatch(loadKeywordsRelevanceAction, params, keywords))
    })

    return promise
  }

  loadAdsKPI = () => {
    this.setState({calculatingKPI: true})

    this.loadingAdGroups.then(this.bulkLoadAdsKPI)
      .then(() => this.setState({calculatingKPI: false}))
  }

  bulkLoadAdsKPI = () => {
    const {dispatch, params, adGroups, folder} = this.props

    const ads = uniq(flatten(map(adGroups, ({ads}) => map(ads, 'id'))))

    const chunks = chunk(ads, 500)

    let promise = Promise.resolve()

    chunks.forEach(adsChunk => {
      promise = promise.then(() =>
        dispatch(loadAdsKPIAction, params, adsChunk, folder))
    })

    return promise
  }

  loadSearchTerms = () => {
    this.setState({loadingSearchTerms: true})

    this.loadingAdGroups.then(this.fetchSearchTerms)
      .then(() => this.setState({loadingSearchTerms: false}))
  }

  fetchSearchTerms = () => {
    const {dispatch, params, adGroups} = this.props

    return dispatch(loadAdGroupSearchTermsAction, params, map(adGroups, 'id'))
  }

  getStatusFilter = () => {
    return this.context.location.query.filter || 'enabled'
  }

  statusProps = (status) => {
    const {location: {pathname}} = this.context
    const props = {
      icon: statusIcons[status],
      disabled: this.state.isLoading
    }

    if (status === this.getStatusFilter()) {
      props.tag = 'strong'
    } else {
      props.to = `${pathname}?filter=${status}`
      props.tag = Link
    }

    return props
  }

  createAdGroup = () => {
    const {dispatch, params} = this.props

    dispatch(pushAdGroupAction, params)
  }

  save = () => {
    if (!this.isAdwords()) return

    const {dispatch, params, getAdGroupsWithRelevance} = this.props

    this.setState({saving: true})

    dispatch(updateAdGroupsAction, params, getAdGroupsWithRelevance())
      .then(this.loadAdGroups)
      .then(() => this.setState({saving: false}))
  }

  state = {
    dirty: false,
    saving: false,
    loadingSearchTerms: false,
    calculatingKPI: false,
    calculatingRelevance: false,
    isLoading: this.isAdwords()
  }

  render () {
    const editMode = endsWith(this.context.location.pathname, '/edit')
    const {
      saving,
      loadingSearchTerms,
      creatingReport,
      calculatingKPI,
      isLoading,
      calculatingRelevance
    } = this.state

    const {adGroups, folder} = this.props

    const inner = this.isAdwords() ? (
      <AdGroups
        location={this.context.location}
        adGroups={adGroups}/>
    ) : <NotImplemented />

    return (
      <div>
        <SubHeader title={<Message>creatives</Message>}>
          {editMode && !isLoading && (
            <Button disabled={saving} onClick={this.save} className='mdl-button mdl-color-text--grey-100'>
              {saving
                ? <Message>saving</Message>
                : <Message>save</Message>}
            </Button>)}

          <Button className='mdl-button mdl-js-button mdl-button--icon'>
            <i className='material-icons'>more_vert</i>

            <DropdownMenu>
              <MenuItem {...this.statusProps('enabled')}>
                <Message>enabledFilterLabel</Message>
              </MenuItem>

              <MenuItem {...this.statusProps('enabled_or_paused')}>
                <Message>enabledOrPausedFilterLabel</Message>
              </MenuItem>

              <MenuItem {...this.statusProps('all')} divider>
                <Message>allFilterLabel</Message>
              </MenuItem>

              <MenuItem disabled={calculatingRelevance} onClick={this.loadKeywordsRelevance} icon='insert_chart'>
                {calculatingRelevance
                  ? <Message>calculating</Message>
                  : <Message>calculateKeywordsRelevance</Message>}
              </MenuItem>

              <MenuItem disabled={calculatingKPI} onClick={this.loadAdsKPI} icon='insert_chart'>
                {calculatingKPI
                  ? <Message>calculating</Message>
                  : <Message kpi={folder.kpi_name}>calculateAdsKPI</Message>}
              </MenuItem>

              <MenuItem disabled={loadingSearchTerms} onClick={this.loadSearchTerms} icon='search'>
                {loadingSearchTerms
                  ? <Message>loading</Message>
                  : <Message>loadSearchTerms</Message>}
              </MenuItem>

              <MenuItem disabled={creatingReport || isLoading} onClick={this.extractReport} icon='file_download'>
                {creatingReport || isLoading
                  ? <Message>creatingReport</Message>
                  : <Message>extractReport</Message>}
              </MenuItem>
            </DropdownMenu>
          </Button>
        </SubHeader>
        <Page>{isLoading
          ? (
            <LoadingHorizontal>
              <Message>loadingAds</Message>
            </LoadingHorizontal>
          ) : inner}
        </Page>
      </div>
    )
  }
}

export default Creatives
