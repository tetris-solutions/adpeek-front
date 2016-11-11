import React from 'react'
import ReportContainer from './Report/Container'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

const {PropTypes} = React

const CompanyReport = React.createClass({
  displayName: 'Company-Report',
  propTypes: {
    report: PropTypes.object,
    location: PropTypes.object,
    metaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    company: PropTypes.shape({
      entities: PropTypes.shape({
        campaigns: PropTypes.array,
        adSets: PropTypes.array,
        keywords: PropTypes.array,
        adGroups: PropTypes.array,
        ads: PropTypes.array
      }),
      savedAccounts: PropTypes.arrayOf(PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      }))
    })
  },
  render () {
    const {params, metaData, dispatch, report, company, location} = this.props

    return (
      <ReportContainer
        dispatch={dispatch}
        report={report}
        params={params}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, '_')}
        {...company.entities}
        accounts={company.savedAccounts}/>
    )
  }
})

export default contextualize(CompanyReport, {metaData: ['reportMetaData']}, 'company', 'report')
