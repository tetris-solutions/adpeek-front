import React from 'react'
import PropTypes from 'prop-types'
import {branch} from '../higher-order/branch'
import UI from '../UI'
import {Card, Header, Content} from '../Card'
import Message from '@tetris/front-server/Message'

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
  mailing: PropTypes.shape(({
    report: PropTypes.shape({
      name: PropTypes.string
    })
  })).isRequired,
  params: PropTypes.shape({
    email: PropTypes.string
  }).isRequired
}

export default branch({mailing: ['unsub']}, Unsub)
