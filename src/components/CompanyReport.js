import React from 'react'
import ReportContainer from './Report/Container'
import {branch} from './higher-order/branch'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

const CompanyReport = React.createClass({
  displayName: 'Company-Report',
  propTypes: {
    report: React.PropTypes.object,
    location: React.PropTypes.object,
    reportMetaData: React.PropTypes.object,
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func,
    company: React.PropTypes.shape({
      entities: React.PropTypes.shape({
        campaigns: React.PropTypes.array,
        adSets: React.PropTypes.array,
        keywords: React.PropTypes.array,
        adGroups: React.PropTypes.array,
        ads: React.PropTypes.array
      }),
      savedAccounts: React.PropTypes.arrayOf(React.PropTypes.shape({
        external_id: React.PropTypes.string,
        tetris_id: React.PropTypes.string,
        platform: React.PropTypes.string
      }))
    })
  },
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
})

export default branch('reportMetaData', CompanyReport)
