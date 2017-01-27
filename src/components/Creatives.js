import React from 'react'
import {Link} from 'react-router'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Button} from './Button'
import AdGroups from './AdGroups'
import Message from 'tetris-iso/Message'
import {loadAdGroupsAction} from '../actions/load-adgroups'
import {createAdGroupsReportAction} from '../actions/create-folder-adgroups-report'
import NotImplemented from './NotImplemented'
import LoadingHorizontal from './LoadingHorizontal'
import SubHeader from './SubHeader'
import Page from './Page'
import {loadKeywordsRelevanceAction} from '../actions/load-keywords-relevance'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import chunk from 'lodash/chunk'

const statusIcons = {
  enabled: 'play_arrow',
  enabled_or_paused: 'pause',
  all: 'playlist_add_check'
}

export const Creatives = React.createClass({
  displayName: 'Creatives',
  propTypes: {
    dispatch: React.PropTypes.func,
    adGroups: React.PropTypes.array,
    adGroupsWithRelevance: React.PropTypes.func,
    platform: React.PropTypes.string,
    params: React.PropTypes.object
  },
  contextTypes: {
    location: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      calculatingRelevance: false,
      isLoading: this.isAdwords()
    }
  },
  isAdwords () {
    return this.props.platform === 'adwords'
  },
  componentDidMount () {
    if (this.isAdwords()) {
      this.loadAdGroups()
    }
  },
  componentWillReceiveProps (props, {location: {query}}) {
    const newFilter = query.filter || 'enabled'
    const currentFilter = this.getStatusFilter()

    if (!this.state.isLoading && newFilter !== currentFilter) {
      this.setState({isLoading: true}, this.loadAdGroups)
    }
  },
  onReportCreated (response) {
    this.setState({creatingReport: false})

    window.location.href = response.data.url
  },
  loadAdGroups () {
    const {params, dispatch} = this.props

    this.loadingAdGroups = dispatch(loadAdGroupsAction, params, this.getStatusFilter())
      .then(() => this.setState({isLoading: false}))
  },
  onAdGroupsLoaded () {
    const {adGroupsWithRelevance, dispatch, params} = this.props

    dispatch(createAdGroupsReportAction, params, adGroupsWithRelevance())
      .then(this.onReportCreated)
  },
  extractReport () {
    if (!this.isAdwords()) return

    this.setState({creatingReport: true})

    this.loadingAdGroups.then(this.onAdGroupsLoaded)
  },
  loadKeywordsRelevance () {
    this.setState({calculatingRelevance: true})

    this.loadingAdGroups
      .then(() => {
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
      })
      .then(() => this.setState({calculatingRelevance: false}))
  },
  getStatusFilter () {
    return this.context.location.query.filter || 'enabled'
  },
  statusProps (status) {
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
  },
  render () {
    const {creatingReport, isLoading, calculatingRelevance} = this.state
    const {adGroups} = this.props
    const inner = this.isAdwords()
      ? <AdGroups adGroups={adGroups}/>
      : <NotImplemented />

    return (
      <div>
        <SubHeader title={<Message>creatives</Message>}>
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
})

export default Creatives
