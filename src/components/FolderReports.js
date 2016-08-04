import React from 'react'
import {ThumbLink, ThumbButton} from './ThumbLink'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

function Report ({company, workspace, folder, id, name}) {
  return <ThumbLink to={`/company/${company}/workspace/${workspace}/folder/${folder}/report/${id}`} title={name}/>
}

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
    children: PropTypes.node,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    folder: PropTypes.object
  },
  render () {
    const {children, folder: {id, reports}, params: {company, workspace}} = this.props

    return (
      <div>
        <div className='mdl-grid'>
          {map(reports, (report, index) =>
            <Report
              key={index} {...report}
              folder={id}
              workspace={workspace}
              company={company}/>)}

          <ThumbButton
            title={<Message>newReportHeader</Message>}
            label={<Message>newReportCallToAction</Message>}
            to={`/company/${company}/workspace/${workspace}/folder/${id}/reports/new`}/>
        </div>
        {children || null}
      </div>
    )
  }
})

export default contextualize(Reports, 'folder')
