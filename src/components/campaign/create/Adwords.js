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
import {loadFolderServiceLinksAction} from '../../../actions/load-folder-service-links'
import map from 'lodash/map'
import Radio from '../../Radio'
import Checkbox from '../../Checkbox'
import toUpper from 'lodash/toUpper'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import {Submit} from '../../Button'

const priorities = [[0, 'low'], [1, 'medium'], [2, 'high']]

const isEmptyArray = x => isArray(x) && isEmpty(x)

const types = {
  SEARCH: 'searchNetwork',
  DISPLAY: 'contentNetwork',
  SHOPPING: 'shoppingNetwork',
  MULTI_CHANNEL: 'multiChannelNetwork'
}

function TheContent ({type, children}) {
  const ls = []

  React.Children
    .toArray(children)
    .forEach(el => {
      const tag = toUpper(el.type)

      if (!types[tag]) {
        ls.push(el)
      }

      if (type === tag) {
        ls.splice(ls.length, 0, ...el.props.children)
      }
    })

  return React.createElement(
    Content,
    null,
    ls
  )
}
TheContent.displayName = 'Content-Wrapper'
TheContent.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node
}

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

  componentDidMount () {
    if (!this.serviceLinksReady()) {
      this.loadServiceLinks()
    }
  }

  loadServiceLinks () {
    this.props.dispatch(loadFolderServiceLinksAction, this.props.params)
  }

  serviceLinksReady () {
    return Boolean(this.props.folder.serviceLinks)
  }

  state = {
    name: '',
    merchantId: '',
    country: 'BR',
    priority: 0,
    type: 'SEARCH',
    enableLocal: false
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
          .push(`/c/${company}/w/${workspace}/f/${folder}/campaign/${id}`)
      })
  }

  onChange = ({target: {type, name, checked, value}}) => {
    this.setState({
      [name]: type === 'checkbox'
        ? checked
        : value
    })
  }

  render () {
    const {messages} = this.context
    const {name, type, country, merchantId, priority, enableLocal} = this.state
    const {serviceLinks} = this.props.folder

    const merchantRequiredError = (
      type === 'SHOPPING' &&
      isEmptyArray(serviceLinks)
    )

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
                <TheContent type={type}>
                  <Input required name='name' value={name} onChange={this.onChange} label='name'/>

                  <Select name='type' label='campaignType' value={type} onChange={this.onChange}>
                    {map(types, (msg, type) =>
                      <option key={type} value={type}>{messages[msg]}</option>)}
                  </Select>

                  <shopping>
                    <Select name='country' label='salesCountry' value={country} onChange={this.onChange}>
                      {map(messages.salesCountries, (name, code) =>
                        <option key={code} value={code}>{name}</option>)}
                    </Select>

                    <Select
                      required
                      error={merchantRequiredError
                        ? messages.noMerchantAvailable
                        : undefined}
                      name='merchantId'
                      label={this.serviceLinksReady() ? 'merchant' : 'loadingMerchants'}
                      value={merchantId}
                      onChange={this.onChange}>

                      <option value=''/>
                      {map(serviceLinks, ({serviceLinkId, name}) => (
                        <option key={serviceLinkId} value={serviceLinkId}>{name}</option>))}
                    </Select>

                    <br/><br/>

                    <Checkbox
                      name='enableLocal'
                      label={<Message>enableLocal</Message>}
                      checked={enableLocal}
                      onChange={this.onChange}/>

                    <h6>
                      <Message>campaignPriority</Message>:
                    </h6>

                    {map(priorities, ([code, name]) =>
                      <div key={code}>
                        <Radio
                          id={`${name}-priority`}
                          name='priority'
                          value={code}
                          checked={Number(priority) === code}
                          onChange={this.onChange}>
                          <Message>{name + 'Priority'}</Message>
                        </Radio>
                      </div>)}
                  </shopping>
                </TheContent>
                <Footer>
                  <Submit className='mdl-button mdl-button--colored' disabled={merchantRequiredError}>
                    <Message>save</Message>
                  </Submit>
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
