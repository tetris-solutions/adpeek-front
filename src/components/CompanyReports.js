import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Reports'

const {PropTypes} = React

export const CompanyReports = React.createClass({
  displayName: 'Company-Reports',
  propTypes: {
    company: PropTypes.shape({
      id: PropTypes.string,
      reports: PropTypes.array
    })
  },
  render () {
    const {company: {id, reports}} = this.props
    const path = `/company/${id}`

    return <Reports path={path} reports={reports}/>
  }
})

export default contextualize(CompanyReports, 'company')
