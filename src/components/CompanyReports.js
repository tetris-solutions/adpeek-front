import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

export const CompanyReports = React.createClass({
  displayName: 'Company-Reports',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    company: React.PropTypes.shape({
      id: React.PropTypes.string,
      reports: React.PropTypes.array
    })
  },
  render () {
    const {params, dispatch, company: {id, reports}} = this.props
    const path = `/company/${id}`

    return <Reports params={params} dispatch={dispatch} path={path} reports={reports}/>
  }
})

export default contextualize(CompanyReports, 'company')
