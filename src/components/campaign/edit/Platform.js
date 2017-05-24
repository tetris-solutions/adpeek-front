import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import keyBy from 'lodash/keyBy'
import filter from 'lodash/filter'
import map from 'lodash/map'
import get from 'lodash/get'
import {parseBidModifier} from '../../../functions/handle-bid-modifier'
import Form from '../../Form'
import Checkbox from '../../Checkbox'
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

function mountPlatforms (criteria) {
  const enabledPlatforms = keyBy(filter(criteria, {type: 'PLATFORM'}), 'id')

  return map(platforms, (name, id) => ({
    id,
    name,
    enabled: Boolean(enabledPlatforms[id]),
    bid_modifier: parseBidModifier(get(enabledPlatforms[id], 'bid_modifier'))
  }))
}

class EditPlatform extends React.Component {
  static displayName = 'Edit-Platform'

  static propTypes = {
    cancel: PropTypes.func,
    campaign: PropTypes.shape({
      criteria: PropTypes.array
    })
  }

  state = {platforms: mountPlatforms(this.props.campaign.criteria)}

  render () {
    return (
      <Form onSubmit={this.save}>
        <table className={`mdl-data-table ${style.table}`}>
          <thead>
            <tr>
              <th/>
              <th className='mdl-data-table__cell--non-numeric'>
                <Message>deviceDescription</Message>
              </th>
              <th>
                <Message>bidModifier</Message>
              </th>
            </tr>
          </thead>
          <tbody>
            {map(this.state.platforms, ({id, name, bid_modifier, enabled}) =>
              <tr key={id}>
                <td className='mdl-data-table__cell--non-numeric'>
                  <Checkbox
                    checked={enabled}
                    name={`platform-${id}-enabled`}/>
                </td>
                <td className='mdl-data-table__cell--non-numeric'>
                  <Message>{lowerFirst(name) + 'Device'}</Message>
                </td>
                <td>
                  <div style={{width: '4em', float: 'right'}}>
                    <Input
                      name={`platform-${id}-bid-modifier`}
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
