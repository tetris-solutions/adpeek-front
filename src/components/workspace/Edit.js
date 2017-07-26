import omit from 'lodash/omit'
import FormMixin from '../mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import AccountSelector from './AccountSelector'
import Input from '../Input'
import {Submit} from '../Button'
import RolesSelector from './RolesSelector'
import {updateWorkspaceAction} from '../../actions/update-workspace'
import {Form, Content, Header, Footer} from '../Card'
import {node} from '../higher-order/branch'
import WorkspaceForm from '../mixins/WorkspaceForm'
import Page from '../Page'
import SubHeader from '../SubHeader'
import {PropertySelector, ViewSelector} from './GAFieldSelector'
import {loadGAPropertiesAction} from '../../actions/load-ga-properties'
import {loadGAViewsAction} from '../../actions/load-ga-views'

const WorkspaceEdit = createReactClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
      workspace: PropTypes.string,
      company: PropTypes.string
    }),
    workspace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  },
  getInitialState () {
    const state = {gaReady: false}
    const {workspace: {accounts: {analytics}}} = this.props

    if (analytics) {
      state.gaAccount = analytics

      if (analytics.ga_property) {
        state.gaProperty = analytics.ga_property
      }

      if (analytics.ga_view) {
        state.gaView = analytics.ga_view
      }
    }

    return state
  },
  onSubmit (e) {
    e.preventDefault()

    const data = this.serializeWorkspaceForm(e.target)

    data.id = this.props.params.workspace

    this.saveWorkspace(data, updateWorkspaceAction)
  },
  onChangeName ({target: {value}}) {
    const errors = omit(this.state.errors, 'name')

    this.setState({errors, 'name': value})
  },
  loadAnalytics () {
    const {gaAccount, gaProperty} = this.state
    const {params, dispatch} = this.props

    const loadProperties = gaAccount
      ? dispatch(loadGAPropertiesAction, params, gaAccount)
      : Promise.resolve()

    const loadViews = gaProperty
      ? () => dispatch(loadGAViewsAction, params, gaAccount, gaProperty.id)
      : Promise.resolve()

    loadProperties
      .then(loadViews)
      .then(() => this.setState({gaReady: true}))
  },
  render () {
    const {errors, name, gaAccount, gaProperty, gaView, gaReady} = this.state
    const {workspace} = this.props
    const roles = workspace.roles
    const {accounts: {facebook, adwords, analytics}} = workspace

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.onSubmit}>
            <Header>
              <Message>editWorkspaceHeader</Message>
            </Header>

            <Content>
              <Input
                label='name'
                name='name'
                error={errors.name}
                onChange={this.onChangeName}
                value={name}/>

              <AccountSelector
                disabled={Boolean(facebook)}
                account={facebook}
                value={facebook ? facebook.name : ''}
                platform='facebook'/>

              <AccountSelector
                disabled={Boolean(adwords)}
                account={adwords}
                value={adwords ? adwords.name : ''}
                platform='adwords'/>

              <AccountSelector
                disabled={Boolean(analytics)}
                account={gaAccount}
                value={gaAccount ? gaAccount.name : ''}
                platform='analytics'
                onLoad={this.loadAnalytics}
                onChange={this.onChangeAnalyticsAccount}/>

              {gaAccount && gaReady && (
                <PropertySelector
                  disabled={Boolean(gaProperty)}
                  selected={gaProperty}
                  onChange={this.onChangeProperty}
                  params={{account: gaAccount.external_id}}/>)}

              {gaProperty && gaReady && (
                <ViewSelector
                  disabled={Boolean(gaView)}
                  selected={gaView}
                  onChange={this.onChangeView}
                  params={{account: gaAccount.external_id, property: gaProperty.id}}/>)}

              <RolesSelector roles={roles}/>
            </Content>

            <Footer>
              <Submit className='mdl-button mdl-button--colored'>
                <Message>save</Message>
              </Submit>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default node('company', 'workspace', WorkspaceEdit)
