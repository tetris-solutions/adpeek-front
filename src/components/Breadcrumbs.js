import csjs from 'csjs'
import map from 'lodash/map'
import React from 'react'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'

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
  font-weight: bold;
  color: white !important;
  text-decoration: none !important;
}
.breadcrumb i {
  float: left;
  margin-top: -.1em;
  margin-right: .3em;
}`

const {PropTypes} = React

function Breadcrumbs (props, {params, routes}) {
  const breadcrumbs = flatten(compact(map(routes, 'breadcrumb')))

  return (
    <span>
      {map(breadcrumbs, (Breadcrumb, index) => (
        <span key={index} className={style.breadcrumb}>
          <Breadcrumb params={params}/>
        </span>))}
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
