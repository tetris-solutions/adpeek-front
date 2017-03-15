import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import pick from 'lodash/pick'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import Checkbox from './Checkbox'
import Input from './Input'
import Select from './Select'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {updateFolderAction} from '../actions/update-folder'
import {Form, Content, Header, Footer} from './Card'
import {node} from './higher-order/branch'
import FolderFormMixin from './mixins/FolderForm'
import AutoSelect from './AutoSelect'
import Page from './Page'
import SubHeader from './SubHeader'

export const EditFolder = React.createClass({
  displayName: 'Edit-Folder',
  mixins: [FormMixin, FolderFormMixin],
  propTypes: {
    dispatch: React.PropTypes.func,
    company: React.PropTypes.object,
    medias: React.PropTypes.array,
    params: React.PropTypes.shape({
      company: React.PropTypes.string,
      workspace: React.PropTypes.string
    }),
    kpis: React.PropTypes.object,
    folder: React.PropTypes.shape({
      id: React.PropTypes.string,
      account: React.PropTypes.object,
      name: React.PropTypes.string,
      tag: React.PropTypes.string,
      workspace_account: React.PropTypes.string,
      media: React.PropTypes.string,
      kpi: React.PropTypes.string
    }),
    workspace: React.PropTypes.shape({
      accounts: React.PropTypes.object
    })
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  componentWillMount () {
    this.setState(pick(this.props.folder, [
      'name',
      'tag',
      'workspace_account',
      'media',
      'kpi',
      'kpi_goal'
    ]))
  },
  componentDidMount () {
    this.loadKPI()
  },
  /**
   * handles submit event
   * @param {Event} e submit event
   * @returns {Promise} promise that resolves once action is complete
   */
  handleSubmit (e) {
    e.preventDefault()
    const {target: {elements}} = e
    const {params: {company, workspace}, folder: {id}} = this.props
    const {dispatch} = this.props
    const folder = {
      id,
      name: elements.name.value,
      workspace_account: elements.workspace_account.value,
      dash_campaign: get(elements, 'dash_campaign.value', null),
      tag: elements.tag.value || null,
      media: elements.media.value,
      kpi: this.state.kpi,
      kpi_goal: this.state.kpi_goal
    }

    if (folder.tag) {
      folder.searchTagsRightAway = elements.searchTagsRightAway.checked
    }

    this.preSubmit()

    const navigateToUpdatedFolder = () => this.context.router.push(`/company/${company}/workspace/${workspace}/folder/${id}`)

    return dispatch(updateFolderAction, company, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(navigateToUpdatedFolder)
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  render () {
    const {medias, company, workspace: {accounts}} = this.props
    const {
      errors,
      kpi,
      kpi_goal,
      name,
      workspace_account,
      dashCampaign,
      media,
      tag
    } = this.state

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.handleSubmit}>
            <Header>
              <Message>editFolderHeader</Message>
            </Header>

            <Content>
              <Input
                label='name'
                name='name'
                error={errors.name}
                value={name}
                onChange={this.saveAndDismiss('name')}/>

              <Select
                disabled
                name='workspace_account'
                label='externalAccount'
                error={errors.workspace_account}
                value={workspace_account}
                onChange={this.saveAndDismiss('workspace_account')}>

                <option value=''/>

                {map(accounts,
                  ({id, platform, name}, index) => (
                    <option key={index} value={id}>
                      {`${platform} :: ${name}`}
                    </option>
                  ))}

              </Select>

              <Select
                name='media'
                label='media'
                error={errors.media}
                value={media}
                onChange={this.saveAndDismiss('media')}>

                <option value=''/>

                {map(medias,
                  ({id, name}, index) => (
                    <option key={index} value={id}>
                      {name}
                    </option>
                  ))}
              </Select>

              <Select
                name='kpi'
                label='kpi'
                error={errors.kpi}
                value={kpi}
                onChange={this.saveAndDismiss('kpi')}>

                <option value=''/>

                {map(get(find(medias, {id: media}), 'kpis'),
                  ({id, name, disabled}, index) => (
                    <option key={index} value={id} disabled={disabled}>
                      {name}
                    </option>
                  ))}
              </Select>

              <Input
                type='number'
                label='kpiGoal'
                name='kpi_goal'
                value={kpi_goal}
                format={this.getKPIFormat()}
                onChange={this.saveAndDismiss('kpi_goal')}/>

              {this.isConnectedToDash()
                ? (
                  <div>
                    <input type='hidden' name='dash_campaign' value={get(dashCampaign, 'id', '')}/>
                    <AutoSelect
                      disabled={this.state.isLoadingDashCampaigns}
                      placeholder={this.context.messages.dashCampaignLabel}
                      onChange={this.onChangeDashCampaign}
                      options={map(company.dashCampaigns, this.normalizeDashCampaignOption)}
                      selected={dashCampaign ? this.normalizeDashCampaignOption(dashCampaign) : null}/>
                  </div>
                ) : null}

              <Input
                name='tag'
                label='folderTag'
                error={errors.tag}
                value={tag || ''}
                onChange={this.saveAndDismiss('tag')}/>

              <br/>

              {tag && (
                <Checkbox
                  checked
                  label={<Message>autoLinkRightAway</Message>}
                  name='searchTagsRightAway'/>)}
            </Content>

            <Footer>
              <Message>save</Message>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default node([
  {
    kpis: ['kpis'],
    medias: ['medias']
  },
  ['user', 'company'],
  ['company', 'workspace'],
  ['workspace', 'folder']
], EditFolder)
