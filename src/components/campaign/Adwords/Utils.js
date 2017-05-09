import React from 'react'
import PropTypes from 'prop-types'
import {style} from './style'
import Message from 'tetris-iso/Message'

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
    <EditLink onClick={edit}/>
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
