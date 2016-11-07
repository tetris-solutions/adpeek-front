import React from 'react'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import head from 'lodash/head'
import get from 'lodash/get'
import {prettyNumber} from '../functions/pretty-number'

const {PropTypes} = React
const style = csjs`
.wrapper {
  display: table;
  height: 100%;
  width: 100%;
}
.title {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: large;
  color: rgb(110, 110, 110);
  margin: .3em 0 0 0;
}
.content {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  font-size: 3vw;
}
.empty {
  color: grey;
}`

const ReportModuleTotal = React.createClass({
  displayName: 'Total',
  mixins: [styled(style)],
  propTypes: {
    name: PropTypes.string.isRequired,
    attributes: PropTypes.object,
    query: PropTypes.shape({
      metrics: PropTypes.array
    }).isRequired,
    result: PropTypes.array.isRequired
  },
  contextTypes: {
    locales: PropTypes.string
  },
  render () {
    const {query: {metrics}, name, result, attributes} = this.props
    const metric = head(metrics)
    const value = get(result, [0, metric])
    const type = get(attributes, [metric, 'type'])
    const {locales} = this.context

    return (
      <div className={String(style.wrapper)}>
        <h5 className={String(style.title)}>
          {name}
        </h5>

        <div className={String(style.content)}>
          {value === undefined ? (
            <span className={String(style.empty)}>---</span>
          ) : prettyNumber(value, type, locales)}
        </div>
      </div>
    )
  }
})

export default ReportModuleTotal
