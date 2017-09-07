import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import keyBy from 'lodash/keyBy'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import map from 'lodash/map'
import get from 'lodash/get'
import {updateCampaignPlatformAction} from '../../../actions/update-campaign-platform'
import {updateAdGroupPlatformAction} from '../../../actions/update-adgroup-platform'
import {parseBidModifier, normalizeBidModifier} from '../../../functions/handle-bid-modifier'
import Form from '../../Form'
import Input from '../../Input'
import {Button, Submit} from '../../Button'
import csjs from 'csjs'
import lowerFirst from 'lodash/lowerFirst'
import {styledComponent} from '../../higher-order/styled'

const style = csjs`
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions > button:first-child {
  float: left;
}
.table {
  width: 100%;
}`

const platforms = {
  30000: 'Desktop',
  30001: 'HighEndMobile',
  30002: 'Tablet'
}

const actions = {
  campaign: updateCampaignPlatformAction,
  adGroup: updateAdGroupPlatformAction
}

function mountPlatforms (criteria) {
  const enabledPlatforms = keyBy(filter(criteria, {type: 'PLATFORM'}), 'id')

  return map(platforms, (name, id) => ({
    id,
    name,
    enabled: Boolean(enabledPlatforms[id]),
    bid_modifier: parseBidModifier(get(enabledPlatforms[id], 'bid_modifier'))
  }))
}

const normalize = ({id, bid_modifier}) => ({
  id,
  bid_modifier: normalizeBidModifier(bid_modifier)
})

class EditPlatform extends React.PureComponent {
  static displayName = 'Edit-Platform'

  static propTypes = {
    level: PropTypes.oneOf(['campaign', 'adGroup']),
    cancel: PropTypes.func,
    criteria: PropTypes.array,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {platforms: mountPlatforms(this.props.criteria)}

  save = () => {
    const {level, onSubmit, params, dispatch} = this.props

    return dispatch(
      actions[level],
      params,
      map(this.state.platforms, normalize))
      .then(onSubmit)
  }

  onChangeBidModifier = ({target: {name, value: bid_modifier}}) => {
    const id = name.split('-').pop()

    this.setState({
      platforms: map(this.state.platforms,
        platform => id === platform.id
          ? assign({}, platform, {bid_modifier})
          : platform)
    })
  }

  render () {
    return (
      <Form onSubmit={this.save}>
        <table className={`mdl-data-table ${style.table}`}>
          <thead>
            <tr>
              <th className='mdl-data-table__cell--non-numeric'>
                <Message>deviceDescription</Message>
              </th>
              <th>
                <Message>bidModifierLabel</Message>
              </th>
            </tr>
          </thead>
          <tbody>{map(this.state.platforms, ({id, name, bid_modifier, enabled}) =>
            <tr key={id}>
              <td className='mdl-data-table__cell--non-numeric'>
                <Message>{lowerFirst(name) + 'Device'}</Message>
              </td>
              <td>
                <div style={{width: '4em', float: 'right'}}>
                  <Input
                    data-id={id}
                    onChange={this.onChangeBidModifier}
                    name={`bid-modifier-${id}`}
                    type='number'
                    format='percentage'
                    defaultValue={bid_modifier || 0}/>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditPlatform, style)
