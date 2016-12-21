import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

const {PropTypes} = React

export const CompanyReports = React.createClass({
  displayName: 'Company-Reports',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    company: PropTypes.shape({
      id: PropTypes.string,
      reports: PropTypes.array
    })
  },
  render () {
    const {params, dispatch, company: {id, reports}} = this.props
    const path = `/company/${id}`

    return <Reports params={params} dispatch={dispatch} path={path} reports={reports}/>
  }
})

export default contextualize(CompanyReports, 'company')
