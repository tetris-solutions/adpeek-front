import React from 'react'
import map from 'lodash/map'
import concat from 'lodash/concat'
import set from 'lodash/set'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import assign from 'lodash/assign'
import keyBy from 'lodash/keyBy'

export const cParams = ls =>
  keyBy(map(isArray(ls) ? concat(ls) : concat(get(ls, 'parameters', [])),
    ({key, value}) => ({
      key,
      value,
      id: Math.random().toString(36).substr(2)
    })), 'id')

export class UrlTracking extends React.Component {
  onChange = ({target: {name, value}}) => {
    this.setState(set(this.state, name, value))
  }

  addCustomParam = () => {
    const id = Math.random().toString(36).substr(2)
    const custom_params = assign({}, this.state.custom_params)

    custom_params[id] = {
      id,
      key: '',
      value: ''
    }

    this.setState({custom_params})
  }

  dropCustomParam = id => {
    const custom_params = assign({}, this.state.custom_params)

    delete custom_params[id]

    this.setState({custom_params})
  }
}
