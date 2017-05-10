import React from 'react'
import PropTypes from 'prop-types'
import {styledFunctionalComponent} from '../higher-order/styled'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'

export const style = csjs`
.edit {
  margin-left: 1em;
  font-size: x-small;
  cursor: pointer;
  text-transform: lowercase;
}
.subText {
  font-size: .6em;
  font-weight: 400;
  margin-left: 1em;
}
.title {
  margin: .3em 0;
  overflow: hidden;
}
.section {
  margin-left: 2em;
  margin-bottom: 1em;
}
.sectionTitle extends .title {
  margin-top: 1em;
  font-style: italic
}`

export const SubText = ({children, tag: Tag}) => (
  <Tag className={`${style.subText}`}>
    {React.Children.count(children)
      ? children
      : <Message>targetNotSetForCampaign</Message>}
  </Tag>
)

SubText.displayName = 'Sub-Text'
SubText.propTypes = {
  tag: PropTypes.string,
  children: PropTypes.node
}
SubText.defaultProps = {
  tag: 'span'
}

export const Italic = props => <SubText {...props} tag='em'/>

Italic.displayName = 'Italic'

export const Info = ({children, edit}) => (
  <h6 className={`${style.title}`}>
    {children}
    {edit && (
      <EditLink onClick={edit}/>)}
  </h6>
)

Info.displayName = 'Info'
Info.propTypes = {
  children: PropTypes.node,
  edit: PropTypes.func
}

export const None = () => <SubText/>
None.displayName = 'None'

export const EditLink = ({onClick}) =>
  <a className={`${style.edit}`} onClick={onClick}>
    <Message>edit</Message>
  </a>

EditLink.displayName = 'Edit-Link'
EditLink.propTypes = {
  onClick: PropTypes.func
}

export const Section = ({children}) => (
  <section className={`${style.section}`}>
    {children}
  </section>
)

Section.displayName = 'Section'
Section.propTypes = {
  children: PropTypes.node.isRequired
}

export const SectionTitle = ({children}) => (
  <h6 className={`${style.secionTitle}`}>
    {children}
  </h6>
)

SectionTitle.displayName = 'Section-Title'
SectionTitle.propTypes = {
  children: PropTypes.node.isRequired
}

const Wrapper_ = ({children}) => (
  <div>
    {children}
  </div>
)

Wrapper_.displayName = 'Wrapper'
Wrapper_.propTypes = {
  children: PropTypes.node.isRequired
}

export const Wrapper = styledFunctionalComponent(Wrapper_, style)
