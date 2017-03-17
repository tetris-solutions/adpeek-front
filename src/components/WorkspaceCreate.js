import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import {loadGAPropertiesAction} from '../actions/load-ga-properties'
import RolesSelector from './WorkspaceRolesSelector'
import {createWorkspaceAction} from '../actions/create-workspace'
import {Form, Content, Header, Footer} from './Card'
import WorkspaceForm from './mixins/WorkspaceForm'
import Page from './Page'
import SubHeader from './SubHeader'

import {node} from './higher-order/branch'
import AutoSelect from './AutoSelect'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'

const Selector = React.createClass({
  displayName: 'S',
  propTypes: {
    account: React.PropTypes.shape({
      properties: React.PropTypes.array
    })
  },
  getInitialState () {
    return {selected: null}
  },
  normalize ({id: value, name: text}) {
    return {text, value}
  },
  componentWillReceiveProps ({account}) {
    if (account !== this.props.account) {
      this.setState({selected: null})
    }
  },
  onChange ({value: id}) {
    this.setState({
      selected: find(this.getProperties(), {id})
    })
  },
  getProperties () {
    return get(this.props.account, 'properties', [])
  },
  render () {
    const {selected} = this.state

    return (
      <AutoSelect
        selected={selected ? this.normalize(selected) : null}
        onChange={this.onChange}
        options={map(this.getProperties(), this.normalize)}/>
    )
  }
})

const PropertySelector = node('company', 'account', Selector)

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },
  getInitialState () {
    return {gaAccount: null}
  },
  onSubmit (e) {
    e.preventDefault()

    const data = this.serializeWorkspaceForm(e.target)

    this.saveWorkspace(data, createWorkspaceAction)
  },
  onChangeAnalyticsAccount (account) {
    const {dispatch, params} = this.props

    if (account) {
      this.setState({gaAccount: account.external_id})

      dispatch(loadGAPropertiesAction, params, account)
    } else {
      this.setState({gaAccount: null})
    }
  },
  render () {
    const {errors, gaAccount} = this.state

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.onSubmit}>
            <Header>
              <Message>newWorkspaceHeader</Message>
            </Header>

            <Content>
              <Input
                label='name'
                name='name'
                error={errors.name}
                onChange={this.dismissError}/>

              <AccountSelector platform='facebook'/>
              <AccountSelector platform='adwords'/>

              <AccountSelector
                platform='analytics'
                onChange={this.onChangeAnalyticsAccount}/>

              {gaAccount && (
                <PropertySelector params={{account: gaAccount}}/>)}

              <RolesSelector/>
            </Content>

            <Footer>
              <Message>newWorkspaceCallToAction</Message>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default CreateWorkspace
