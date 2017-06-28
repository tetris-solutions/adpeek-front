import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Page from '../../Page'
import SubHeader from '../../SubHeader'
import {Form, Content, Header, Footer} from '../../Card'
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
    name: '',
    type: 'SEARCH'
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  onSubmit = () => {
    const {dispatch, params} = this.props
    const {company, workspace, folder} = params

    const create = () => dispatch(createCampaignAction, params, this.state)
    const reload = () => dispatch(loadFolderCampaignsAction, company, workspace, folder)

    return create()
      .then(createResponse => reload()
        .then(() => createResponse))
      .then(({data: {id}}) => {
        this.context.router
          .push(`/company/${company}/workspace/${workspace}/folder/${folder}/campaign/${id}`)
      })
  }

  render () {
    const {messages} = this.context

    return (
      <div>
        <SubHeader/>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <Form onSubmit={this.onSubmit}>
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
                <Footer>
                  <Message>save</Message>
                </Footer>
              </Form>
            </div>
          </div>
        </Page>
      </div>
    )
  }
}

export default CreateAdwordsCampaign
