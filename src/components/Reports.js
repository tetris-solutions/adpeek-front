import React from 'react'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import Fence from './Fence'
import Page from './Page'
import {Container, Title, ThumbLink} from './ThumbLink'
import SubHeader, {SubHeaderButton} from './SubHeader'
import {Link} from 'react-router'

const {PropTypes} = React

const Report = ({path, id, name}) => (
  <ThumbLink to={`${path}/report/${id}`} title={name}>
    <Title>{name}</Title>
  </ThumbLink>
)

Report.displayName = 'Report'
Report.propTypes = {
  id: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string
}

export const Reports = React.createClass({
  displayName: 'Reports',
  propTypes: {
    reports: PropTypes.array,
    path: PropTypes.string
  },
  render () {
    const {reports, path} = this.props

    return (
      <div>
        <SubHeader>
          <Fence canEditReport>
            <SubHeaderButton tag={Link} to={`${path}/reports/new`}>
              <i className='material-icons'>add</i>
              <Message>newReportHeader</Message>
            </SubHeaderButton>
          </Fence>
        </SubHeader>
        <Page>
          <Container>
            {map(reports, (report, index) =>
              <Report key={index} {...report} path={path}/>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default Reports
