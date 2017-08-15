import csjs from 'csjs'
import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import reportParamsType from '../../../propTypes/report-params'
import {loadCreativeAction} from '../../../actions/load-creative'
import {routeParamsBasedBranch} from '../../higher-order/branch'
import {styledComponent} from '../../higher-order/styled'

const style = csjs`
.post {
  width: 256px;
  background-color: white;
  border-radius: 3px;
  padding: 1em;
  border: 1px solid rgb(200, 200, 200);
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
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

function Creative ({thumbnail, body}) {
  return (
    <div className={style.post}>
      <img src={thumbnail}/>
      <p>{body}</p>
    </div>
  )
}

Creative.displayName = 'Creative'
Creative.propTypes = {
  thumbnail: PropTypes.string,
  body: PropTypes.string
}

class AdCreative extends React.Component {
  static displayName = 'Ad-Creative'

  static propTypes = {
    reportParams: reportParamsType,
    creative: PropTypes.object,
    params: PropTypes.shape({
      company: PropTypes.string,
      account: PropTypes.string
    }),
    company: PropTypes.shape({
      creatives: PropTypes.array
    }),
    account: PropTypes.string,
    dispatch: PropTypes.func,
    creative_id: PropTypes.string,
    name: PropTypes.string
  }

  componentDidMount () {
    const {reportParams, creative, dispatch, params} = this.props

    if (creative) return

    dispatch(loadCreativeAction,
      params,
      get(reportParams, ['accounts', 0, 'tetris_account']))
  }

  render () {
    const {name, creative} = this.props

    if (!creative) {
      return <span>{name}</span>
    }

    return <Creative {...creative} />
  }
}

const AdCreativeBranch = routeParamsBasedBranch(
  'company',
  'creative',
  styledComponent(AdCreative, style),
  1,
  true
)

const AdCreativeWrapper = props => (
  <AdCreativeBranch {...props} params={{creative: props.creative_id}}/>
)

AdCreativeWrapper.displayName = 'Ad-Creative-Wrapper'
AdCreativeWrapper.propTypes = {
  creative_id: PropTypes.string
}

export default AdCreativeWrapper
