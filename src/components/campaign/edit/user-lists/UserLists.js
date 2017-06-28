import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {Checkbox} from '../../../Checkbox'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'
import {isUserList} from '../../Utils'
import {loadFolderUserListsAction} from '../../../../actions/load-folder-user-lists'
import {updateCampaignUserListsAction} from '../../../../actions/update-campaign-user-list'
import values from 'lodash/values'
import find from 'lodash/find'
import Input from '../../../Input'
import {parseBidModifier, normalizeBidModifier} from '../../../../functions/handle-bid-modifier'
import unionBy from 'lodash/unionBy'

const parse = u => ({
  id: u.user_list_id || u.id,
  name: u.user_list_name || u.name,
  status: u.user_list_status || u.status,
  bid_modifier: parseBidModifier(u.bid_modifier)
})

const normalize = ({id, name, status, bid_modifier}) => ({
  id,
  name,
  status,
  bid_modifier: normalizeBidModifier(bid_modifier)
})

class EditUserLists extends React.PureComponent {
  static displayName = 'Edit-User-Lists'

  static propTypes = {
    cancel: PropTypes.func,
    campaign: PropTypes.object,
    folder: PropTypes.shape({
      userLists: PropTypes.array
    }),
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  componentDidMount () {
    if (!this.props.folder.userLists) {
      this.load()
    }
  }

  load = () => {
    const {dispatch, params} = this.props

    return dispatch(loadFolderUserListsAction, params)
      .then(() => this.setState({loading: false}))
  }

  campaignUserLists = () => {
    return filter(this.props.campaign.details.criteria, isUserList)
  }

  state = {
    loading: !this.props.folder.userLists,
    selected: keyBy(map(this.campaignUserLists(), parse), 'id')
  }

  getUserListById = id => {
    return normalize(find(this.props.folder.userLists, {id}))
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props

    return dispatch(updateCampaignUserListsAction, params, values(this.state.selected))
      .then(onSubmit)
  }

  onCheck = ({target: {checked, value: id}}) => {
    const selected = assign({}, this.state.selected)

    if (checked) {
      delete selected[id]
    } else {
      selected[id] = this.getUserListById(id)
    }

    this.setState({selected})
  }

  onChangeBidModifier = ({target: {name, value}}) => {
    const selected = assign({}, this.state.selected)
    const id = name.split('-').pop()

    if (!selected[id]) {
      selected[id] = this.getUserListById(id)
    }

    selected[id].bid_modifier = value

    this.setState({selected})
  }

  render () {
    const {selected, loading} = this.state
    const userLists = unionBy(values(selected), map(this.props.folder.userLists, parse), 'id')

    return (
      <Form onSubmit={this.save}>
        <div className={style.list}>
          <table className={`mdl-data-table ${style.table}`}>
            <thead>
              <tr>
                <th className='mdl-data-table__cell--non-numeric'/>
                <th className='mdl-data-table__cell--non-numeric'>
                  <Message>nameLabel</Message>
                </th>
                <th>
                  <Message>bidModifierLabel</Message>
                </th>
              </tr>
            </thead>
            <tbody>{map(userLists, ({id, name, status, bid_modifier}) =>
              <tr key={id}>
                <td className='mdl-data-table__cell--non-numeric'>
                  <Checkbox
                    checked={Boolean(selected[id])}
                    name='user-list'
                    value={id}
                    onChange={this.onCheck}/>
                </td>
                <td className='mdl-data-table__cell--non-numeric'>
                  {name}
                </td>
                <td>
                  <Input
                    name={`bid-modifier-${id}`}
                    type='number'
                    format='percentage'
                    value={bid_modifier || 0}
                    onChange={this.onChangeBidModifier}/>
                </td>
              </tr>)}
            </tbody>
          </table>

          {loading && (
            <p style={{textAlign: 'center', marginTop: '2em'}}>
              <Message>loadingUserLists</Message>
            </p>)}
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored' disabled={loading}>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditUserLists, style)
