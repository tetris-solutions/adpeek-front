import React from 'react'
import PropTypes from 'prop-types'
import {style} from './style'
import Message from 'tetris-iso/Message'

export const SubText = props => <span {...props} className={`${style.subText}`}/>
export const Italic = props => <em {...props} className={`${style.subText}`}/>

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

export const None = () =>
  <SubText>
    <Message>targetNotSetForCampaign</Message>
  </SubText>

None.displayName = 'None'

export const EditLink = ({onClick}) =>
  <a className={`${style.edit}`} onClick={onClick}>
    <Message>edit</Message>
  </a>

EditLink.displayName = 'Edit-Link'
EditLink.propTypes = {
  onClick: PropTypes.func
}
