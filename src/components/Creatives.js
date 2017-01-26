import React from 'react'
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

export const Creatives = React.createClass({
  displayName: 'Creatives',
  propTypes: {
    dispatch: React.PropTypes.func,
    adGroups: React.PropTypes.array,
    platform: React.PropTypes.string,
    params: React.PropTypes.object
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
  onReportCreated (response) {
    this.setState({creatingReport: false})

    window.location.href = response.data.url
  },
  loadAdGroups () {
    const {params, dispatch} = this.props

    this.loadingAdGroups = dispatch(loadAdGroupsAction, params)
      .then(() => this.setState({isLoading: false}))
  },
  onAdGroupsLoaded () {
    const {adGroups, dispatch, params} = this.props

    dispatch(createAdGroupsReportAction, params, adGroups)
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
  render () {
    const {creatingReport, isLoading, calculatingRelevance} = this.state
    const {adGroups} = this.props
    const inner = this.isAdwords()
      ? <AdGroups adGroups={adGroups}/>
      : <NotImplemented />
    const btClass = 'mdl-button mdl-color-text--grey-100'

    return (
      <div>
        <SubHeader title={<Message>creatives</Message>}>
          <Button className={btClass} disabled={calculatingRelevance} onClick={this.loadKeywordsRelevance}>
            {calculatingRelevance
              ? <Message>calculating</Message>
              : <Message>calculateKeywordsRelevance</Message>}
          </Button>

          <Button disabled={creatingReport || isLoading} onClick={this.extractReport} className={btClass}>
            {creatingReport || isLoading
              ? <Message>creatingReport</Message>
              : <Message>extractReport</Message>}
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
