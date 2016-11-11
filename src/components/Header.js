import React from 'react'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import gravatar from 'gravatar'
import Tooltip from 'tetris-iso/Tooltip'
import {contextualize} from './higher-order/contextualize'
import {logoutAction} from 'tetris-iso/actions'
import get from 'lodash/get'
import {Link} from 'react-router'

const style = csjs`
.round {
  border-radius: 50%;
}
.crop {
  overflow: hidden;
}
.tetris {
  width: auto;
  height: 24px;  
}
.manager {
  width: auto;
  height: 20px;
  margin-left: 12px;
}
.row {
  padding: 0 30px;
}
.header {}
.logout {
  color: rgb(100, 100, 100);
  font-size: small;
  width: 100%;
  text-transform: none;
  padding: 0;
}
.link extends .round, .crop {
  display: inline-block;
  position: relative;
  width: auto;
}
.link > div {
  display: block;
  width: 100%;
  bottom: 0;
  position: absolute;
  background: rgba(70, 70, 70, 0.3);
  font-size: x-small;
  color: white;
  text-decoration: none;
}
.menu {
  width: 250px;
  padding: 1em 0 1em 0;
  height: auto;
  text-align: center;
  color: #515151;
}
.name {
  font-size: large;
  font-weight: 600;
  margin: .4em 0 .1em 0;
}
.face extends .round {
  width: 100px;
  height: 100px;
}
.icon {
  width: 32px;
  height: 32px;  
}
.button extends .round, .crop {
  position: relative;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border 1s ease;
}
.button:hover, .button[data-active] {
  border: 3px solid #5c9cfe;
}`

const {PropTypes} = React
const userType = (company, isAdmin) =>
  get(
    company, 'role.name',
    isAdmin
      ? <Message>globalAdmin</Message>
      : <Message>regularUser</Message>
  )
const pTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  email: PropTypes.string,
  is_admin: PropTypes.bool,
  company: PropTypes.object,
  logout: PropTypes.func.isRequired
}

const DropDown = ({name, avatar, email, is_admin, company, logout}) => (
  <div>
    <div className={String(style.menu)}>
      <a href={`${process.env.FRONT_URL}/dashboard/profile`} className={String(style.link)}>
        <img className={String(style.face)} src={avatar || gravatar.url(email, {s: '100'})}/>
        <div>
          <Message>edit</Message>
        </div>
      </a>
      <div className={String(style.name)}>{name}</div>
      <sup>{userType(company, is_admin)}</sup>
    </div>
    <a className={`mdl-button mdl-button--raised ${style.logout}`} onClick={logout}>
      <i className='material-icons'>keyboard_backspace</i>
      <Message>navLogout</Message>
    </a>
  </div>
)

DropDown.displayName = 'DropDown'
DropDown.propTypes = pTypes

const UserMenu = props => (
  <a className={String(style.button)}>
    <img
      className={String(style.icon)}
      src={props.avatar || gravatar.url(props.email, {s: '32'})}/>

    <Tooltip>
      <DropDown {...props}/>
    </Tooltip>
  </a>
)

UserMenu.displayName = 'UserMenu'
UserMenu.propTypes = pTypes

const Header = React.createClass({
  displayName: 'Header',
  mixins: [styled(style)],
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string
    }).isRequired,
    company: PropTypes.object
  },
  loginRoundTrip () {
    this.props.dispatch(logoutAction)

    window.location.href = process.env.FRONT_URL + '/login?next=' + window.location.href
  },
  render () {
    const {user, company} = this.props
    let GoHome, homeProps, leftButton

    if (user.is_guest) {
      GoHome = 'a'
      homeProps = {href: '/'}

      leftButton = (
        <button type='button' className='mdl-button mdl-color-text--grey-100' onClick={this.loginRoundTrip}>
          <Message>navLogin</Message>
        </button>
      )
    } else {
      GoHome = Link
      homeProps = {to: '/'}
      leftButton = <UserMenu {...user} company={company} logout={this.loginRoundTrip}/>
    }

    return (
      <header className={`mdl-layout__header mdl-color--primary-dark ${style.header}`}>
        <div className={`mdl-layout__header-row ${style.row}`}>
          <GoHome {...homeProps}>
            <img className={String(style.tetris)} src={'/img/tetris-logo.png'}/>
            <img className={String(style.manager)} src={'/img/manager-logo.png'}/>
          </GoHome>
          <div className='mdl-layout-spacer'/>

          {leftButton}
        </div>
      </header>
    )
  }
})

export default contextualize(Header, 'user', 'company')
