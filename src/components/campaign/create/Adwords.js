import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Page from '../../Page'
import SubHeader from '../../SubHeader'
import {Submit} from '../../Button'
import Form from '../../Form'
import {Card, Content, Header} from '../../Card'
import Input from '../../Input'

class CreateAdwordsCampaign extends React.Component {
  static displayName = 'Create-Adwords-Campaign'
  static propTypes = {
    folder: PropTypes.object
  }

  onSubmit = e => {

  }

  render () {
    return (
      <Form onSubmit={this.onSubmit}>
        <SubHeader>
          <Submit className='mdl-button mdl-color-text--grey-100'>
            <Message>save</Message>
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
                  <Input
                    required
                    name='name'
                    label='name'/>
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
