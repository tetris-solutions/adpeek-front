import React from 'react'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import {contextualize} from './higher-order/contextualize'
import Fence from './Fence'
import Page from './Page'
import {Container, Title, ThumbLink} from './ThumbLink'
import SubHeader, {SubHeaderButton} from './SubHeader'
import {Link} from 'react-router'

const {PropTypes} = React

const Report = ({company, workspace, folder, id, name}) => (
  <ThumbLink to={`/company/${company}/workspace/${workspace}/folder/${folder}/report/${id}`} title={name}>
    <Title>{name}</Title>
  </ThumbLink>
)

Report.displayName = 'Report'
Report.propTypes = {
  id: PropTypes.string,
  folder: PropTypes.string,
  workspace: PropTypes.string,
  company: PropTypes.string,
  name: PropTypes.string
}

export const Reports = React.createClass({
  displayName: 'Reports',
  propTypes: {
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    folder: PropTypes.object
  },
  render () {
    const {folder: {id, reports}, params: {company, workspace}} = this.props

    return (
      <div>
        <SubHeader>
          <Fence canEditReport>
            <SubHeaderButton tag={Link} to={`/company/${company}/workspace/${workspace}/folder/${id}/reports/new`}>
              <i className='material-icons'>add</i>
              <Message>newReportHeader</Message>
            </SubHeaderButton>
          </Fence>
        </SubHeader>
        <Page>
          <Container>
            {map(reports, (report, index) =>
              <Report
                key={index} {...report}
                folder={id}
                workspace={workspace}
                company={company}/>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default contextualize(Reports, 'folder')
