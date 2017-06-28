import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../Form'
import {Button, Submit} from '../../Button'
import {Checkbox} from '../../Checkbox'
import {style} from '../../campaign/edit/style'
import {styledComponent} from '../../higher-order/styled'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'
import {isUserList} from '../../campaign/Utils'
import {loadFolderUserListsAction} from '../../../actions/load-folder-user-lists'
import {updateCampaignUserListsAction} from '../../../actions/update-campaign-user-list'
import find from 'lodash/find'
import Input from '../../Input'
import {parseBidModifier, normalizeBidModifier} from '../../../functions/handle-bid-modifier'
import orderBy from 'lodash/orderBy'

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
    criteria: PropTypes.array,
    folder: PropTypes.shape({
      userLists: PropTypes.array
    }),
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  componentDidMount () {
    this.load()
  }

  load = () => {
    const {dispatch, params, folder: {userLists}} = this.props

    if (userLists) return Promise.resolve()

    return dispatch(loadFolderUserListsAction, params)
      .then(() => this.setState({loading: false}))
  }

  state = {
    loading: !this.props.folder.userLists,
    selected: keyBy(map(filter(this.props.criteria, isUserList), parse), 'id')
  }

  getUserListById = id => {
    return parse(find(this.props.folder.userLists, {id}))
  }

  save = () => {
    const {dispatch, params, onSubmit} = this.props

    return dispatch(updateCampaignUserListsAction, params, map(this.state.selected, normalize))
      .then(onSubmit)
  }

  onCheck = ({target: {checked, value: id}}) => {
    const selected = assign({}, this.state.selected)

    if (checked) {
      selected[id] = this.getUserListById(id)
    } else {
      delete selected[id]
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

  parseAndCheck = userList => {
    userList = parse(userList)

    userList._selected = Boolean(this.state.selected[userList.id])

    return userList
  }

  sortedList = () => {
    if (!this.props.folder.userLists) return []

    if (!this._ls) {
      this._ls = orderBy(
        map(this.props.folder.userLists, this.parseAndCheck),
        ['_selected', 'name'], ['desc', 'asc']
      )
    }

    return this._ls
  }

  render () {
    const {selected, loading} = this.state

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
            <tbody>{map(this.sortedList(), ({id, name, status}) =>
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
                  <div className={style.numberInputCell}>
                    <Input
                      name={`bid-modifier-${id}`}
                      type='number'
                      format='percentage'
                      value={selected[id] ? selected[id].bid_modifier || 0 : 0}
                      onChange={this.onChangeBidModifier}/>
                  </div>
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
