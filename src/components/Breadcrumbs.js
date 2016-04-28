import React from 'react'
import filter from 'lodash/filter'
import map from 'lodash/map'
import has from 'lodash/fp/has'
import csjs from 'csjs'

const style = csjs`
.breadcrumb {
  display: inline-block;
  padding: 0 1em;
}`

const {PropTypes} = React
const hasBreadcrumbs = has('breadcrumb')

export function Breadcrumbs ({routes, params}, {insertCss}) {
  insertCss(style)
  return (
    <span>
      {map(filter(routes, hasBreadcrumbs), ({breadcrumb}, index) => {
        const Breadcrumb = breadcrumb
        return (
          <span key={index} className={style.breadcrumb}>
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

Breadcrumbs.contextTypes = {
  insertCss: PropTypes.func
}

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
