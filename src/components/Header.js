import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import gravatar from 'gravatar'
import Tooltip from 'tetris-iso/Tooltip'
import {contextualize} from './higher-order/contextualize'
import {logoutAction} from 'tetris-iso/actions'
import get from 'lodash/get'

const style = csjs`
.round {
  border-radius: 50%;
}
.crop {
  overflow: hidden;
}
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
  padding: 2em 0;
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
  border: 2px solid transparent;
}
.button:hover {
  box-shadow: -1px 2px 3px rgba(0,0,0,0.2);
  border: 2px solid #5c9cfe;
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
  logout () {
    this.props.dispatch(logoutAction)

    window.location.href = process.env.FRONT_URL + '/login?next=' + window.location.href
  },
  render () {
    const {user, company} = this.props

    return (
      <header className='mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600'>
        <div className='mdl-layout__drawer-button'/>
        <div className='mdl-layout__header-row'>
          <Breadcrumbs />
          <div className='mdl-layout-spacer'/>
          <UserMenu {...user} company={company} logout={this.logout}/>
        </div>
      </header>
    )
  }
})

export default contextualize(Header, 'user', 'company')
