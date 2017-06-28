import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {Checkbox} from '../../../Checkbox'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import filter from 'lodash/filter'
import map from 'lodash/map'
import unionBy from 'lodash/unionBy'
import {isUserList} from '../../Utils'
import {loadFolderUserListsAction} from '../../../../actions/load-folder-user-lists'
import {updateCampaignUserListsAction} from '../../../../actions/update-campaign-user-list'
import includes from 'lodash/includes'
import concat from 'lodash/concat'
import without from 'lodash/without'
import find from 'lodash/find'

const parse = ({user_list_id: id, user_list_name: name, user_list_status: status}) => ({id, name, status})

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
    return map(filter(this.props.campaign.details.criteria, isUserList), parse)
  }

  state = {
    loading: !this.props.folder.userLists,
    selected: map(this.campaignUserLists(), 'id')
  }

  save = () => {
    const {dispatch, params} = this.props

    return dispatch(updateCampaignUserListsAction, params,
      map(this.state.selected, id =>
        find(this.props.folder.userLists, {id})))
  }

  onChange = ({target: {checked, value: id}}) => {
    this.setState({
      selected: checked
        ? concat(this.state.selected, id)
        : without(this.state.selected, id)
    })
  }

  render () {
    const {selected, loading} = this.state
    const userLists = unionBy(this.campaignUserLists(), this.props.folder.userLists, 'id')

    return (
      <Form onSubmit={this.save}>
        <div className={style.list}>
          <table className={`mdl-data-table ${style.table}`}>
            <thead>
              <tr>
                <th className='mdl-data-table__cell--non-numeric'/>
                <th className='mdl-data-table__cell--non-numeric'>
                  Name
                </th>
                <th>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>{map(userLists, ({id, name, status}) =>
              <tr key={id}>
                <td className='mdl-data-table__cell--non-numeric'>
                  <Checkbox
                    checked={includes(selected, id)}
                    name='user-list'
                    value={id}
                    onChange={this.onChange}/>
                </td>
                <td className='mdl-data-table__cell--non-numeric'>
                  {name}
                </td>
                <td className='mdl-data-table__cell--non-numeric'>
                  {status}
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
