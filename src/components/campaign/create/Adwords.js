import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Page from '../../Page'
import SubHeader from '../../SubHeader'
import {Submit} from '../../Button'
import Form from '../../Form'
import {Card, Content, Header} from '../../Card'
import Input from '../../Input'
import Select from '../../Select'
import {createCampaignAction} from '../../../actions/create-campaign'
import {loadFolderCampaignsAction} from '../../../actions/load-folder-campaigns'

class CreateAdwordsCampaign extends React.Component {
  static displayName = 'Create-Adwords-Campaign'

  static propTypes = {
    folder: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object,
    messages: PropTypes.object
  }

  state = {
    saving: false,
    name: '',
    type: 'SEARCH'
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  onSubmit = e => {
    const {dispatch, params} = this.props
    const {company, workspace, folder} = params
    const {name, type} = this.state

    const create = () => dispatch(createCampaignAction, params, {name, type})
    const reload = () => dispatch(loadFolderCampaignsAction, company, workspace, folder)

    this.setState({saving: true})

    create()
      .then(createResponse => reload().then(() => createResponse))
      .then(({data: {id}}) => {
        this.context.router
          .push(`/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${id}`)
      })
  }

  render () {
    const {messages} = this.context

    return (
      <Form onSubmit={this.onSubmit}>
        <SubHeader>
          <Submit disabled={this.state.saving} className='mdl-button mdl-color-text--grey-100'>
            {this.state.saving
              ? <Message>saving</Message>
              : <Message>save</Message>}
          </Submit>
        </SubHeader>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <Card>
                <Header>
                  <Message>newCampaign</Message>
                </Header>

                <Content>
                  <Input required name='name' value={this.state.name} onChange={this.onChange} label='name'/>

                  <br/><br/>

                  <Select name='type' label='campaignType' value={this.state.type} onChange={this.onChange}>
                    <option value='SEARCH'>{messages.searchNetwork}</option>
                    <option value='DISPLAY'>{messages.contentNetwork}</option>
                    <option value='SHOPPING'>{messages.shoppingNetwork}</option>
                    <option value='MULTI_CHANNEL'>{messages.multiChannelNetwork}</option>
                  </Select>
                </Content>
              </Card>
            </div>
          </div>
        </Page>
      </Form>
    )
  }
}

export default CreateAdwordsCampaign
