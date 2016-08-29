import csjs from 'csjs'
import find from 'lodash/find'
import React from 'react'

import reportParamsType from '../propTypes/report-params'
import {loadCreativeAction} from '../actions/load-creative'
import {contextualize} from './higher-order/contextualize'
import {styled} from './mixins/styled'

const {PropTypes} = React
const style = csjs`
.post {
  width: 256px;
  background-color: white;
  border-radius: 3px;
  padding: 1em;
  border: 1px solid rgb(200, 200, 200);
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.3);
}
.post > h2 {
  color: #365899;
  font-size: medium;
  font-weight: bold;
  line-height: 1.7em;
  padding: 0;
  margin: 0 0 .3em 0;
}
.post > img {
  border: 1px solid rgb(220, 220, 220);
  width: 98%;
  height: auto;
  margin: 0 auto;
}
.post > p {
  font-size: small;
  margin: .5em 0;
  white-space: normal;
}`

const AdCreative = React.createClass({
  displayName: 'Ad-Creative',
  mixins: [styled(style)],
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

    return (
      <div className={`${style.post}`}>
        <h2>{creative.title}</h2>
        <img src={creative.thumbnail} />
        <p>{creative.body}</p>
      </div>
    )
  }
})

export default contextualize(AdCreative, 'company')
