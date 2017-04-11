import React from 'react'
import PropTypes from 'prop-types'
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }),
  params: PropTypes.shape({
    report: PropTypes.string
  })
}

export default ExpiredReport
