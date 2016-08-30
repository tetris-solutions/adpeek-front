import csjs from 'csjs'
import filter from 'lodash/filter'
import has from 'lodash/fp/has'
import map from 'lodash/map'
import React from 'react'

import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.breadcrumb {
  display: inline-block;
  padding: 0 1em;
}
.breadcrumb i {
  float: left;
  margin-top: -.1em;
  margin-right: .3em;
}`

const {PropTypes} = React
const hasBreadcrumbs = has('breadcrumb')

export function Breadcrumbs (props, {params, routes}) {
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

Breadcrumbs.contextTypes = {
  params: PropTypes.object,
  routes: PropTypes.array
}

Breadcrumbs.displayName = 'Breadcrumbs'

export default styledFnComponent(Breadcrumbs, style)
