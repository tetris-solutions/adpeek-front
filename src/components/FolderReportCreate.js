import React from 'react'
import Switch from './Switch'
import Input from './Input'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import {contextualize} from './higher-order/contextualize'
import {createFolderReportAction} from '../actions/create-folder-report'
import {Form, Content, Header, Footer} from './Card'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

const CreateReport = React.createClass({
  displayName: 'Create-Report',
  mixins: [FormMixin],
  contextTypes: {
    router: PropTypes.object
  },
  propTypes: {
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    }).isRequired,
    folder: PropTypes.shape({
      id: PropTypes.string,
      account: PropTypes.shape({
        platform: PropTypes.string
      })
    }),
    dispatch: PropTypes.func.isRequired
  },
  handleSubmit (e) {
    e.preventDefault()
    const {target: {elements}} = e
    const {
      folder: {account: {platform}}, dispatch,
      params: {folder, company, workspace}
    } = this.props

    const report = {
      name: elements.name.value,
      is_private: elements.isPrivate.checked,
      level: 'folder',
      platform,
      company
    }

    this.preSubmit()

    dispatch(createFolderReportAction, company, workspace, folder, report)
      .then(response => {
        const reportId = response.data.id

        this.context.router.push(
          `/company/${company}/workspace/${workspace}/folder/${folder}/report/${reportId}/edit`
        )
      })
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  render () {
    const {errors} = this.state

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header>
          <Message>newReportHeader</Message>
        </Header>

        <Content>

          <Input
            required
            label='name'
            name='name'
            error={errors.name}
            onChange={this.dismissError}/>

          <Switch
            label={<Message>isPrivateReport</Message>}
            name='isPrivate'/>

        </Content>

        <Footer>
          <Message>newReportCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(CreateReport, 'folder')
