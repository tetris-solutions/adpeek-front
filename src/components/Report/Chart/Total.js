import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import head from 'lodash/head'
import get from 'lodash/get'
import {prettyNumber} from '../../../functions/pretty-number'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'

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
  font-size: 64px;
}
.content[title] {
  font-style: italic;
}
.empty {
  color: grey;
}`

class TotalChart extends React.Component {
  static displayName = 'Total-Chart'

  static propTypes = {
    name: PropTypes.string.isRequired,
    attributes: PropTypes.object,
    query: PropTypes.shape({
      metrics: PropTypes.array
    }).isRequired,
    result: PropTypes.array.isRequired
  }

  static contextTypes = {
    locales: PropTypes.string
  }

  render () {
    const {query: {metrics}, name, result, attributes} = this.props
    const metric = head(metrics)
    const is_percentage = get(attributes, [metric, 'is_percentage'])
    const divProps = {
      className: `${style.content}`
    }

    const raw = get(result, [0, metric])

    let value = raw
    let type = get(attributes, [metric, 'type'])

    if (type === 'special') {
      if (isObject(value)) {
        value = raw.value

        if (isString(raw.raw)) {
          divProps.title = raw.raw
        }
      }

      if (is_percentage) {
        type = 'percentage'
      }
    }

    const {locales} = this.context

    return (
      <div className={String(style.wrapper)}>
        <h5 className={String(style.title)}>
          {name}
        </h5>

        <div {...divProps}>
          {value === undefined
            ? <span className={String(style.empty)}>---</span>
            : prettyNumber(value, type, locales)}
        </div>
      </div>
    )
  }
}

export default styledComponent(TotalChart, style)
