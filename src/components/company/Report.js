import React from 'react'
import PropTypes from 'prop-types'
import ReportContainer from '../report/Container'
import {branch} from '../higher-order/branch'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

class CompanyReport extends React.Component {
  static displayName = 'Company-Report'

  static propTypes = {
    report: PropTypes.object,
    location: PropTypes.object,
    reportMetaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    company: PropTypes.shape({
      entities: PropTypes.shape({
        campaigns: PropTypes.array
      }),
      savedAccounts: PropTypes.arrayOf(PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      }))
    })
  }

  render () {
    const {reportMetaData: metaData, company, location} = this.props

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, '_')}
        {...company.entities}
        accounts={company.savedAccounts}/>
    )
  }
}

export default branch('reportMetaData', CompanyReport, 2)
