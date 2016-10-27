import React from 'react'
import Input from './Input'
import FormMixin from './mixins/FormMixin'
import {createReportAction} from '../actions/create-report'
import {cloneReportAction} from '../actions/clone-report'
import {Form, Content, Header, Footer} from './Card'
import Message from 'tetris-iso/Message'
import Page from './Page'
import SubHeader from './SubHeader'
import join from 'lodash/join'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

const {PropTypes} = React

const ReportCreate = React.createClass({
  displayName: 'Create-Report',
  mixins: [FormMixin],
  contextTypes: {
    router: PropTypes.object
  },
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired,
    platform: PropTypes.string,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getDefaultProps () {
    return {
      platform: null
    }
  },
  handleSubmit (e) {
    e.preventDefault()
    const {platform, location: {query}, dispatch, params} = this.props
    const {folder, company, workspace} = params

    const report = {
      id: query.clone || null,
      name: e.target.elements.name.value,
      level: inferLevelFromParams(params),
      platform,
      company
    }

    this.preSubmit()

    const action = report.id ? cloneReportAction : createReportAction

    return dispatch(action, params, report)
      .then(response => {
        const reportId = response.data.id

        const scope = join(compact([
          `company/${company}`,
          workspace && `workspace/${workspace}`,
          folder && `folder/${folder}`
        ]), '/')

        this.context.router.push(`/${scope}/report/${reportId}/edit`)
      })
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },

  render () {
    const {location: {query}} = this.props
    const {errors} = this.state

    return (
      <div>
        <SubHeader/>
        <Page>
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
        </Page>
      </div>
    )
  }
})

export default ReportCreate
