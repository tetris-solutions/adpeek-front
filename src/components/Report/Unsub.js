import React from 'react'
import {branch} from '../higher-order/branch'
import UI from '../UI'
import {Card, Header, Content} from '../Card'
import Message from 'tetris-iso/Message'

const Unsub = ({mailing, params}) => (
  <UI hideLogin>
    <Card>
      <Header>
        <Message>unsubscriptionTitle</Message>
      </Header>
      <Content>
        <p>
          <Message
            html
            email={params.email}
            report={mailing.report.name}>
            unsubscriptionBody
          </Message>
        </p>
      </Content>
    </Card>
  </UI>
)

Unsub.displayName = 'Unsubscription'
Unsub.propTypes = {
  mailing: React.PropTypes.shape(({
    report: React.PropTypes.shape({
      name: React.PropTypes.string
    })
  })).isRequired,
  params: React.PropTypes.shape({
    email: React.PropTypes.string
  }).isRequired
}

export default branch({mailing: ['unsub']}, Unsub)
