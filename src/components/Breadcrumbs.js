import React from 'react'
import filter from 'lodash/filter'
import map from 'lodash/map'
import has from 'lodash/fp/has'

const {PropTypes} = React
const hasBreadcrumbs = has('breadcrumb')

export function Breadcrumbs ({routes, params}) {
  return (
    <span>
      {map(filter(routes, hasBreadcrumbs), ({breadcrumb}, index) => {
        const Breadcrumb = breadcrumb
        return (
          <span key={index} className='HeaderBreadcrumb'>
            <Breadcrumb params={params}/>
          </span>
        )
      })}
    </span>
  )
}

Breadcrumbs.propTypes = {
  routes: PropTypes.array,
  params: PropTypes.object
}

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
