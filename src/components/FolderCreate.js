import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import {createFolderAction} from '../actions/create-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import Select from './Select'
import map from 'lodash/map'
import find from 'lodash/find'
import get from 'lodash/get'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import Checkbox from './Checkbox'
import AutoSelect from './AutoSelect'
import FolderFormMixin from './mixins/FolderForm'
import Page from './Page'
import SubHeader from './SubHeader'

const {PropTypes} = React

export const CreateFolder = React.createClass({
  displayName: 'Create-Folder',
  mixins: [FormMixin, FolderFormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    company: PropTypes.object,
    medias: PropTypes.array,
    kpis: PropTypes.object,
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
    const {dispatch} = this.props
    const folder = {
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

    const navigateToFolderList = () => this.context.router.push(`/company/${company}/workspace/${workspace}`)

    return dispatch(createFolderAction, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(navigateToFolderList)
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
    const {medias, company, workspace: {accounts}} = this.props
    const {errors, kpi, kpi_goal, workspace_account, selectedMedia, showTagCheckbox, dashCampaign} = this.state

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
                label='name'
                name='name'
                error={errors.name}
                onChange={this.dismissError}/>

              <Select
                name='workspace_account'
                label='externalAccount'
                error={errors.workspace_account}
                value={workspace_account}
                onChange={this.saveAndDismiss('workspace_account')}>

                <option value=''/>

                {map(accounts,
                  ({id, platform_name, name}, index) => (
                    <option key={index} value={id}>
                      {`${platform_name} :: ${name}`}
                    </option>
                  ))}

              </Select>

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
              </Select>

              <Select
                name='kpi'
                label='kpi'
                error={errors.kpi}
                value={kpi}
                onChange={this.saveAndDismiss('kpi')}>

                <option value=''/>

                {map(get(find(medias, {id: selectedMedia}), 'kpis'),
                  ({id, name}, index) => (
                    <option key={index} value={id}>
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
                onChange={this.onChangeTag}/>

              <br/>

              {showTagCheckbox && (
                <Checkbox
                  checked
                  label={<Message>autoLinkRightAway</Message>}
                  name='searchTagsRightAway'/>)}

            </Content>

            <Footer>
              <Message>newFolderCallToAction</Message>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default contextualize(CreateFolder, {medias: ['medias']}, 'workspace', 'company')
