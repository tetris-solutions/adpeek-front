import React from 'react'
import Message from 'tetris-iso/Message'
import {breakOnEmptyProp} from '../../higher-order/not-nullable'
import {derivative} from '../../higher-order/branch'
import {loadAccountDetailsAction} from '../../../actions/load-account-details'
import PropTypes from 'prop-types'
import SubHeader from '../../SubHeader'
import Page from '../../Page'
import AccountDetails from './Card'
import LoadingHorizontal from '../../LoadingHorizontal'
import {Card, Content, Header} from '../../Card'
import {Wrapper, Info, SubText} from '../../campaign/Utils'
import capitalize from 'lodash/capitalize'

const NotAvailable = ({account: {name, platform}}) => (
  <Wrapper>
    <Info disabled>
      <Message>nameLabel</Message>:
      <SubText>{name}</SubText>
    </Info>

    <Info disabled>
      <Message>platformLabel</Message>:
      <SubText>{capitalize(platform)}</SubText>
    </Info>

    <br/>

    <p className='mdl-color--yellow-300 mdl-color-text--grey-700' style={{padding: '1em'}}>
      <strong>
        <Message>emptyAccountDetails</Message>
      </strong>
    </p>
  </Wrapper>
)

NotAvailable.displayName = 'Not-Available'
NotAvailable.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
    platform: PropTypes.string
  })
}

class FolderAccount extends React.PureComponent {
  static displayName = 'Folder-Account'

  static propTypes = {
    params: PropTypes.object.isRequired,
    account: PropTypes.shape({
      name: PropTypes.string,
      details: PropTypes.object
    }),
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.loadDetails()
  }

  loadDetails (fresh = false) {
    return this.props.dispatch(loadAccountDetailsAction, this.props.params, fresh)
  }

  reload = () => {
    return this.loadDetails(true)
  }

  render () {
    const {account} = this.props

    const Account = account.platform === 'adwords'
      ? AccountDetails
      : NotAvailable

    const isLoading = !account.details

    return (
      <div>
        <SubHeader/>
        <Page>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              {isLoading ? (
                <LoadingHorizontal>
                  <Message>loadingAccountDetails</Message>
                </LoadingHorizontal>
              ) : (
                <Card size='medium'>
                  <Header>
                    <Message>accountDetailsTitle</Message>
                  </Header>
                  <Content>
                    <Account {...this.props} reload={this.reload}/>
                  </Content>
                </Card>
              )}
            </div>
          </div>
        </Page>
      </div>
    )
  }
}

export default derivative('folder', 'account',
  breakOnEmptyProp(FolderAccount, 'account'))
