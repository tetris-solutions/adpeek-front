import React from 'react'
import csjs from 'csjs'
import {Button} from '../../../Button'
import Message from 'tetris-iso/Message'
import {styledFnComponent} from '../../../higher-order/styled-fn-component'

const style = csjs`
.box {
  text-align: center;
  line-height: 1.5em;
  padding: 1em 0; 
  margin-bottom: 2em;
}`

const MissingIdAlert = ({add}, {entity}) =>
  <div className={`mdl-color--yellow-200 mdl-color-text--grey-700 ${style.box}`}>
    <Message entity={entity.name} html>
      missingIdAlert
    </Message>

    <br/>
    <Button className='mdl-button mdl-button--primary' onClick={add}>
      <Message entity={entity.name}>
        selectIdDimension
      </Message>
    </Button>
  </div>

MissingIdAlert.displayName = 'Missing-Id'
MissingIdAlert.propTypes = {
  add: React.PropTypes.func
}
MissingIdAlert.contextTypes = {
  entity: React.PropTypes.object
}

export default styledFnComponent(MissingIdAlert, style)
