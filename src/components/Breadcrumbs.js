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
.breadcrumb:empty {
  display: none;
}
.breadcrumb a {
  color: white !important;
  text-decoration: none !important;
}
.breadcrumb i {
  float: left;
  margin-top: -.1em;
  margin-right: .3em;
}`

const {PropTypes} = React
const hasBreadcrumbs = has('breadcrumb')

function Breadcrumbs (props, {params, routes}) {
  return (
    <span>
      {map(filter(routes, hasBreadcrumbs),
        ({breadcrumb: Breadcrumb}, index) => (
          <span key={index} className={style.breadcrumb}>
            <Breadcrumb params={params}/>
          </span>
        ))}
      {props.title ? (
        <span className={style.breadcrumb}>
          {props.title}
        </span>
      ) : null}
    </span>
  )
}

Breadcrumbs.propTypes = {
  title: PropTypes.node
}
Breadcrumbs.contextTypes = {
  params: PropTypes.object,
  routes: PropTypes.array
}

Breadcrumbs.displayName = 'Breadcrumbs'

export default styledFnComponent(Breadcrumbs, style)
