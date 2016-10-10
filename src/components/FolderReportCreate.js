import React from 'react'
import Input from './Input'
import FormMixin from './mixins/FormMixin'
import {contextualize} from './higher-order/contextualize'
import {createFolderReportAction} from '../actions/create-folder-report'
import {cloneFolderReportAction} from '../actions/clone-folder-report'
import {Form, Content, Header, Footer} from './Card'
import Message from 'tetris-iso/Message'

const {PropTypes} = React

const CreateReport = React.createClass({
  displayName: 'Create-Report',
  mixins: [FormMixin],
  contextTypes: {
    router: PropTypes.object
  },
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired,
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
      location: {query},
      folder: {account: {platform}}, dispatch,
      params: {folder, company, workspace}
    } = this.props

    const report = {
      id: query.clone || null,
      name: elements.name.value,
      level: 'folder',
      platform,
      company
    }

    this.preSubmit()

    const action = report.id ? cloneFolderReportAction : createFolderReportAction

    dispatch(action, company, workspace, folder, report)
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
    const {location: {query}} = this.props
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
            defaultValue={query.name}
            onChange={this.dismissError}/>
        </Content>

        <Footer>
          <Message>newReportCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(CreateReport, 'folder')
