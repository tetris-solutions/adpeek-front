import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import FormMixin from '../mixins/FormMixin'
import concat from 'lodash/concat'
import Message from 'tetris-iso/Message'
import Input from '../Input'
import {Submit} from '../Button'
import {createFolderAction} from '../../actions/create-folder'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import Select from '../Select'
import map from 'lodash/map'
import find from 'lodash/find'
import get from 'lodash/get'
import {Form, Content, Header, Footer} from '../Card'
import {many} from '../higher-order/branch'
import Checkbox from '../Checkbox'
import AutoSuggest from '../AutoSuggest'
import FolderFormMixin from '../mixins/FolderForm'
import Page from '../Page'
import SubHeader from '../SubHeader'

const CreateFolder = createReactClass({
  displayName: 'Create-Folder',
  mixins: [FormMixin, FolderFormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    company: PropTypes.object,
    medias: PropTypes.array,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    workspace: PropTypes.shape({
      accounts: PropTypes.object
    })
  },
  contextTypes: {
    router: PropTypes.object
  },
  getInitialState () {
    return {
      kpi: '',
      kpi_goal: 0,
      workspace_account: '',
      showTagCheckbox: false,
      selectedMedia: ''
    }
  },
  /**
   * handles submit event
   * @param {Event} e submit event
   * @returns {Promise} promise that resolves once action is complete
   */
  handleSubmit (e) {
    e.preventDefault()
    const {target: {elements}} = e
    const {params: {company, workspace}} = this.props
    const {dashCampaign, gaSegment} = this.state
    const {dispatch} = this.props

    const folder = {
      name: elements.name.value,
      workspace_account: elements.workspace_account.value,
      dash_campaign: dashCampaign ? dashCampaign.id : '',
      tag: get(elements, 'tag.value', null),
      media: get(elements, 'media.value', null),
      kpi: this.state.kpi,
      kpi_goal: this.state.kpi_goal,
      ga_segment: gaSegment || null
    }

    if (this.isAnalytics()) {
      folder.media = 'display'
      folder.kpi = 'cpa'
      folder.ga_segment = folder.ga_segment || this.DEFAULT_GA_SEGMENT
    }

    if (folder.tag) {
      folder.searchTagsRightAway = elements.searchTagsRightAway.checked
    }

    this.preSubmit()

    const navigateToFolderList = response => {
      this.context.router.push(`/c/${company}/w/${workspace}/folder/${response.data.id}`)
    }

    return dispatch(createFolderAction, workspace, folder)
      .then(navigateToFolderList)
      .then(() => dispatch(pushSuccessMessageAction))
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  onChangeMedia (e) {
    this.dismissError(e)

    this.setState({
      selectedMedia: e.target.value
    })
  },
  onChangeTag (e) {
    this.dismissError(e)

    this.setState({
      showTagCheckbox: Boolean(e.target.value)
    })
  },

  render () {
    const {messages} = this.context
    const {medias, company, workspace: {accounts}} = this.props
    const {errors, kpi, kpi_goal, workspace_account, selectedMedia, showTagCheckbox, dashCampaign, gaSegment} = this.state
    const hasAnalytics = this.hasAnalytics()
    const isAnalytics = this.isAnalytics()

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.handleSubmit}>
            <Header>
              <Message>newFolderHeader</Message>
            </Header>

            <Content>
              <Input
                required
                label='name'
                name='name'
                error={errors.name}
                onChange={this.dismissError}/>

              <Select
                required
                name='workspace_account'
                label='externalAccount'
                error={errors.workspace_account}
                value={workspace_account}
                onChange={this.onChangeInput}>

                <option value=''/>

                {map(accounts,
                  ({id, platform_name, name}, index) => (
                    <option key={index} value={id}>
                      {`${platform_name} :: ${name}`}
                    </option>
                  ))}

              </Select>

              {!isAnalytics && (
                <Select
                  name='media'
                  label='media'
                  error={errors.media}
                  value={selectedMedia}
                  onChange={this.onChangeMedia}>

                  <option value=''/>

                  {map(medias,
                    ({id, name}, index) => (
                      <option key={index} value={id}>
                        {name}
                      </option>
                    ))}
                </Select>)}

              {!isAnalytics && (
                <Select
                  name='kpi'
                  label='kpi'
                  error={errors.kpi}
                  value={kpi}
                  onChange={this.onChangeInput}>

                  <option value=''/>

                  {map(get(find(medias, {id: selectedMedia}), 'kpis'),
                    ({id, name, disabled}, index) => (
                      <option key={index} value={id} disabled={disabled}>
                        {name}
                      </option>
                    ))}
                </Select>)}

              {!isAnalytics && (
                <Input
                  type='number'
                  label='kpiGoal'
                  name='kpi_goal'
                  value={kpi_goal}
                  format={this.getKPIFormat()}
                  onChange={this.onChangeInput}/>)}

              {this.isConnectedToDash() && (
                <AutoSuggest
                  disabled={this.state.isLoadingDashCampaigns}
                  placeholder={messages.dashCampaignLabel}
                  onChange={this.onChangeDashCampaign}
                  selected={dashCampaign ? this.normalizeDashCampaignOption(dashCampaign) : null}
                  options={concat({
                    value: this.CREATE_OPTION_FLAG,
                    text: messages.newDashCampaign
                  }, map(company.dashCampaigns, this.normalizeDashCampaignOption))}/>
              )}

              {hasAnalytics
                ? (
                  <AutoSuggest
                    selected={gaSegment ? this.normalizeAutoSuggestOption(gaSegment) : null}
                    onChange={this.onChangeSegment}
                    placeholder={messages.gaSegmentLabel}
                    options={this.getSegments()}/>
                ) : null}

              {isAnalytics && !gaSegment ? (
                <p style={{wordBreak: 'break-all'}}>
                  <Message>defaultGASegmentAlert</Message>
                </p>
              ) : null}

              {gaSegment && gaSegment.definition ? (
                <p>
                  <em>
                    {gaSegment.definition}
                  </em>
                </p>
              ) : null}

              {!isAnalytics && (
                <Input
                  name='tag'
                  label='folderTag'
                  error={errors.tag}
                  onChange={this.onChangeTag}/>)}

              <br/>

              {!isAnalytics && showTagCheckbox && (
                <Checkbox
                  checked
                  label={<Message>autoLinkRightAway</Message>}
                  name='searchTagsRightAway'/>)}

            </Content>
            <Footer>
              <Submit className='mdl-button mdl-button--colored'>
                <Message>newFolderCallToAction</Message>
              </Submit>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default many([
  {kpis: ['kpis'], medias: ['medias']},
  ['user', 'company'],
  ['company', 'workspace']
], CreateFolder)
