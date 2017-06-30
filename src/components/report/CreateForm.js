import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import Input from '../Input'
import {Submit} from '../Button'
import FormMixin from '../mixins/FormMixin'
import {createReportAction} from '../../actions/create-report'
import {cloneReportAction} from '../../actions/clone-report'
import {Form, Content, Header, Footer} from '../Card'
import Message from 'tetris-iso/Message'
import Page from '../Page'
import SubHeader from '../SubHeader'
import join from 'lodash/join'
import compact from 'lodash/compact'

const ReportCreate = createReactClass({
  displayName: 'Create-Report',
  mixins: [FormMixin],
  contextTypes: {
    router: PropTypes.object,
    tree: PropTypes.object
  },
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    }).isRequired
  },
  handleSubmit (e) {
    e.preventDefault()
    const {location: {query}, params} = this.props
    const {folder, company, workspace} = params
    const report = {
      id: query.clone || null,
      name: e.target.elements.name.value,
      company
    }

    this.preSubmit()

    const action = report.id ? cloneReportAction : createReportAction

    return action(this.context.tree, params, report)
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
              <Submit className='mdl-button mdl-button--colored'>
                <Message>newReportCallToAction</Message>
              </Submit>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default ReportCreate
