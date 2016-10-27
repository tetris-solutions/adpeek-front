import React from 'react'
import {contextualize} from './higher-order/contextualize'
import ReportCreate from './ReportCreate'

const {PropTypes} = React

const CompanyReportCreate = React.createClass({
  displayName: 'Company-Report-Create',
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired,
    params: PropTypes.shape({
      company: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  },
  render () {
    const {location, params, dispatch} = this.props

    return (
      <ReportCreate
        location={location}
        params={params}
        dispatch={dispatch}/>
    )
  }
})

export default contextualize(CompanyReportCreate, 'company')
