import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import ReportLink from '../report/Link'
import endsWith from 'lodash/endsWith'
import Fence from '../Fence'
import {Navigation, NavBt, NavLink, NavBts, Name} from '../Navigation'
import DeleteButton from '../DeleteButton'
import {deleteFolderAction} from '../../actions/delete-folder'
import {node} from '../higher-order/branch'
import get from 'lodash/get'

class FolderAside extends React.PureComponent {
  static displayName = 'Folder-Aside'

  static propTypes = {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    }),
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    })
  }

  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object
  }

  onClickDelete = () => {
    const {dispatch, params} = this.props
    const {router} = this.context
    const {company, workspace, folder} = params

    return dispatch(deleteFolderAction, params, folder)
      .then(() => {
        router.replace(`/company/${company}/workspace/${workspace}`)
      })
  }

  render () {
    const {dispatch, folder, params} = this.props
    const {location} = this.context
    const {company, workspace} = params

    const isAnalytics = get(folder, 'account.platform') === 'analytics'
    const baseUrl = `/company/${company}/workspace/${workspace}/folder/${folder.id}`
    const backspaceUrl = endsWith(location.pathname, folder.id)
      ? `/company/${company}/workspace/${workspace}`
      : baseUrl

    return (
      <Fence canEditFolder>{({canEditFolder}) =>
        <Navigation icon='folder'>
          <Name>
            {folder.name}
          </Name>
          <NavBts>
            {canEditFolder && (
              <NavLink to={`${baseUrl}/account`} icon='account_circle'>
                <Message>editFolderAccount</Message>
              </NavLink>)}

            {!isAnalytics && <NavLink to={`${baseUrl}/creatives`} icon='receipt'>
              <Message>creatives</Message>
            </NavLink>}

            {!isAnalytics && <NavLink to={`${baseUrl}/orders`} icon='attach_money'>
              <Message>folderOrders</Message>
            </NavLink>}

            <ReportLink tag={NavLink} params={params} reports={folder.reports} dispatch={dispatch}>
              <Message>folderReport</Message>
            </ReportLink>

            {canEditFolder && (
              <NavLink to={`${baseUrl}/edit`} icon='mode_edit'>
                <Message>editFolder</Message>
              </NavLink>)}

            {canEditFolder && (
              <NavBt tag={DeleteButton} entityName={folder.name} onClick={this.onClickDelete} icon='delete'>
                <Message>deleteFolder</Message>
              </NavBt>)}

            <NavLink to={backspaceUrl} icon='close'>
              <Message>oneLevelUpNavigation</Message>
            </NavLink>
          </NavBts>
        </Navigation>}
      </Fence>
    )
  }
}

export default node('workspace', 'folder', FolderAside)
