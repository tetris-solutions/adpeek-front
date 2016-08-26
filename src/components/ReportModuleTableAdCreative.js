import find from 'lodash/find'
import React from 'react'

import reportParamsType from '../propTypes/report-params'
import {loadCreativeAction} from '../actions/load-creative'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

const AdCreative = React.createClass({
  displayName: 'Ad-Creative',
  propTypes: {
    reportParams: reportParamsType,
    params: PropTypes.shape({
      company: PropTypes.string,
      account: PropTypes.string
    }),
    company: PropTypes.shape({
      creatives: PropTypes.array
    }),
    account: PropTypes.string,
    dispatch: PropTypes.func,
    creative: PropTypes.object,
    creative_id: PropTypes.string,
    name: PropTypes.string
  },
  componentDidMount () {
    const {reportParams, creative_id, dispatch, params} = this.props

    if (this.getCreative()) return

    dispatch(loadCreativeAction,
      params.company,
      reportParams.tetris_account,
      creative_id)
  },
  getCreative () {
    const {company, creative_id} = this.props

    return find(company.creatives, {
      id: creative_id
    })
  },
  render () {
    const {name} = this.props
    const creative = this.getCreative()

    if (!creative) {
      return <span>{name}</span>
    }

    return <pre>{JSON.stringify(creative, null, 2)}</pre>
  }
})

export default contextualize(AdCreative, 'company')
