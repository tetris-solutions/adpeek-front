import React from 'react'
import UI from '../UI'
import {Card, Header, Content, Footer} from '../Card'
import Message from 'tetris-iso/Message'

const makeLoginUrl = ({pathname, search}) => (
  process.env.FRONT_URL + '/login?next=' + encodeURIComponent(
    process.env.ADPEEK_URL +
    pathname.replace('/expired/', '/share/') +
    search
  )
)

const ExpiredReport = ({params, location}) => (
  <UI hideLogin>
    <Card>
      <Header>
        <Message>
          expiredReportTitle
        </Message>
      </Header>

      <Content>
        <p>
          <Message html report={params.report}>
            expiredReportBody
          </Message>
        </p>
      </Content>

      <Footer multipleButtons>
        <a className='mdl-button mdl-button--colored' href={makeLoginUrl(location)}>
          <Message>navLogin</Message>
        </a>
      </Footer>
    </Card>
  </UI>
)

ExpiredReport.displayName = 'Expired-Report'
ExpiredReport.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
    search: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    report: React.PropTypes.string
  })
}

export default ExpiredReport
