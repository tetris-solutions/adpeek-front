import React from 'react'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'
import omit from 'lodash/omit'

const {PropTypes} = React
const style = csjs`
.wrapper {
  width: 270px;
  margin: 10px 0;
}
.wrapper > hr {
  width: 80%;
  margin: 0 auto;
}
.icon {
  font-size: 72px;
  display: block;
  text-align: center;
  margin: .5em 0;
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
  margin: .7em 0;
  padding: 0;
  line-height: 3.5em;
  height: auto;
  text-transform: none;
  text-align: left;
  width: 100%;
}
.button i {
  margin: 0 .5em 0 1em;
}
.name {
  margin-left: 20px;
}`

export const NavBt = props => {
  const {tag: Tag, children, icon} = props
  const otherProps = omit(props, 'tag', 'icon', 'children')
  const className = `mdl-button mdl-button--raised mdl-button--colored mdl-color--primary-dark ${style.button}`

  return (
    <Tag className={className} {...otherProps}>
      {icon ? <i className='material-icons'>{icon}</i> : null}
      {children || null}
    </Tag>
  )
}
NavBt.displayName = 'Nav-Button'
NavBt.defaultProps = {
  tag: 'a'
}
NavBt.propTypes = {
  tag: PropTypes.any,
  href: PropTypes.string,
  to: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export const NavBts = ({children}) => (
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
NavBts.displayName = 'Nav-Buttons'

Name.propTypes = NavBts.propTypes = {
  children: PropTypes.node.isRequired
}

const Wrapper = ({icon, img, children}) => (
  <div className={`${style.wrapper}`}>
    {img
      ? <img className={`${style.img}`} src={img}/>
      : <i className={`material-icons ${style.icon}`}>{icon}</i>}
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
