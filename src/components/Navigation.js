import React from 'react'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'

const {PropTypes} = React
const style = csjs`
.wrapper {
  width: 270px;
  margin: 10px 0;
}
.icon {
  padding-top: 20px;
  font-size: 56px;
}
.img {
  width: 200px;
  height: auto;
  margin: 10px auto;
  display: block;
}
.menu {
  display: block;
  text-align: center;
  margin: 0 8%;
}
.button {
  display: block;
  margin: .5em 0;
  line-height: 3em;
  height: auto;
  text-transform: none;
  text-align: left;
  padding: 0 10px 0 20px;
}
.button i {
  margin-right: .5em;
}
.name {
  margin-left: 20px;
}`

export const Button = ({tag: Tag, href, to, onClick, children, icon}) => (
  <Tag className={`mdl-button mdl-button--raised mdl-button--colored mdl-color--primary-dark ${style.button}`} {...{
    href,
    to,
    onClick
  }}>
    {icon ? <i className='material-icons'>{icon}</i> : null}
    {children}
  </Tag>
)
Button.displayName = 'Button'
Button.defaultProps = {
  tag: 'a'
}
Button.propTypes = {
  tag: PropTypes.any,
  href: PropTypes.string,
  to: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
}

export const Buttons = ({children}) => (
  <section className={`${style.menu}`}>
    {children}
  </section>
)
export const Name = ({children}) => (
  <section className={`${style.name}`}>
    <h4>
      {children}
    </h4>
  </section>
)
Name.displayName = 'Name'
Buttons.displayName = 'Buttons'

Name.propTypes = Buttons.propTypes = {
  children: PropTypes.node.isRequired
}

const Wrapper = ({icon, img, children}) => (
  <div className={`${style.wrapper}`}>
    {img ? (
      <img className={`${style.img}`} src={img}/>
    ) : (
      <i className='material-icons'>{icon}</i>
    )}
    {children}
  </div>
)

Wrapper.displayName = 'Navigation'
Wrapper.propTypes = {
  icon: PropTypes.string,
  img: PropTypes.string,
  children: PropTypes.node
}

export const Navigation = styledFnComponent(Wrapper, style)
